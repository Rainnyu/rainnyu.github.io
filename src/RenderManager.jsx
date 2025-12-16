import React, { useRef, useEffect } from 'react';

const vsSource =
`
attribute vec3 aPos;
uniform mat4 uRotMtx;

void main()
{
    gl_Position = uRotMtx * vec4(aPos, 1.0);
}
`

const fsSource =
`
void main()
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

function CompileShader(gl, type, source)
{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.error('Unable to compile shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function LinkProgram(gl, vs, fs)
{
    const vtxShdr = CompileShader(gl, gl.VERTEX_SHADER, vs);
    const frgShdr = CompileShader(gl, gl.FRAGMENT_SHADER, fs);

    const shdrPgm = gl.createProgram();
    gl.attachShader(shdrPgm, vtxShdr);
    gl.attachShader(shdrPgm, frgShdr);
    gl.linkProgram(shdrPgm);

    if (!gl.getProgramParameter(shdrPgm, gl.LINK_STATUS))
    {
        console.error('Unable to link shaders: ' + gl.getShaderInfoLog(shdrPgm));
        gl.deleteProgram(shdrPgm);
        return null;
    }
    return shdrPgm;
}

function WebGLTriangle()
{
    const canvasRef = useRef(null);

useEffect(()=> 
    {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if(!gl)
    {
        alert('WebGL not supported in this browser');
        return;
    }
    const shaderPgm = LinkProgram(gl, vsSource, fsSource);
    if(!shaderPgm) return;
    gl.useProgram(shaderPgm);

    const vertices = new Float32Array([
        0.0,  0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0
        ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttrib = gl.getAttribLocation(shaderPgm, 'aPos');
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttrib);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

}, []); // The empty array [] means this effect runs only once

    return (<canvas ref={canvasRef} width="800" height="600" />);
}

export default WebGLTriangle;