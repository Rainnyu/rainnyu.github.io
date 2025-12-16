import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import * as THREE from "three"
import './App.css'

function CameraControls()
{
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  useFrame((state) => {
    const scrollY = window.scrollY;
    const targetY = -(maxScroll > 0 ? scrollY / maxScroll : 0) * 5;

    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1);
    });
}

function Cube({position, size, color})
{
    const ref = useRef();
    // Is hover Stuff
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Delta Time stuffs
    useFrame((state, delta) =>{
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta * 2;
    ref.current.position.y -= delta * 1;
    if(ref.current.position.y < -10)
    {
        ref.current.position.y += 14;
        ref.current.position.x = (Math.random() - 0.5) * 20;
    }
    })

  return (
      <mesh 
      ref={ref}
      onPointerEnter={(event) => {event.stopPropagation(), setIsHovered(true)}}
      onPointerLeave={()=> setIsHovered(false)}
      onClick={()=> setIsClicked(!isClicked)}
      position={position}
      scale={isClicked ? 1.5 : 1}
        >
        <boxGeometry args={size}/>
        <meshStandardMaterial color={isHovered ? color : [0.1,0.1,0.1]}/>
      </mesh>
  )
}

function CubeSpawner({count})
{
    const cubes = [];
    for(let i =0; i < count; i++)
    {
        const position = [(Math.random() - 0.5) * 20, Math.random() * 100 - 100, (Math.random() - 0.5) * 2];
        const size = [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5];
        const color = [Math.random(), Math.random(), Math.random()];
        cubes.push(<Cube key={i} position={position} size={size} color={color}/>);
    }
    return cubes;
}

function App() {
  return (
    <>
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%'}}>
    <Canvas eventSource={document.body} eventPrefix="client">
      <color attach="background" args={['lightcyan']} />
      <CameraControls />
      <directionalLight position={[0, 0.1, 1]} intensity={1.0}/>
      <CubeSpawner count={100}/>
      {/*
      <Cube position={[0,0,2]} color={"blue"} size={[1,1,1]}/>
      <mesh
        position={[0,0,-1]}
        scale={[10,10,10]}>
        <planeGeometry/>
        <meshStandardMaterial color ={"green"} />
      </mesh>
      */}
    </Canvas>
    </div>
    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', color: 'black', zIndex:1}}>
      <div id="Banner">
        <div id="HeaderPadding">
          <h1 id="NamePlate">Rainne Won Yu Xuan</h1>
          <div>
            <span class="ProfileDescriptor">SG</span>
            <span class="ProfileDescriptor">Aspiring Software Engineer</span>
          </div>
          <div id="NavBar">
            <div id="NavBarLeft">
              <p class="NavBarContent ActiveNav">Home</p>
              <a href="" class="NavBarContent">Projects</a>
              <a href="" class="NavBarContent">Skills</a>
              <a href="" class="NavBarContent">Education</a>
            </div>
            <div id="NavBarRight">
              <a href="https://ra-ivl.itch.io/" target="_blank"><img src="assets/Itchio_ico.png" /></a>
              <a href="https://www.linkedin.com/in/rainne-won-35289b1ab/" target="_blank"><img src="assets/Linkedin_ico.png" /></a>
            </div>
          </div>
        </div>
      </div>

      <div id="BodyPadding">

      <div id="home">
        <div id="leftHome">
        <p>
          Lots of test Padding;<br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          End of Line.
        </p>
        </div>
        <div id="rightHome">
          <div class="homeContent">
            <h2>About Me</h2>
            <div class="lineBreak"></div>
            <p>
                Hello, Nice to meet you.<br />
                I require a 1 year internship for my school module.<br />
                Please hire me, thank you!
            </p>
          </div>
        </div>
      </div>

      </div>
    </div>
    </>
  )
}

export default App
