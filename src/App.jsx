import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import { Text3D, Center } from "@react-three/drei"
import * as THREE from "three"
import './App.css'

const fontURL = '../assets/Fonts/helvetiker_regular.typeface.json';
function GetImgURL(name, ext)
{
  return new URL(`../assets/${name}.${ext}`, import.meta.url).href
}
function GetLogoURL(name, ext)
{
  return new URL(`../assets/Logos/${name}.${ext}`, import.meta.url).href
}


function TopFunc()
{
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function CameraControls()
{
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  useFrame((state) => {
    const scrollY = window.scrollY;
    const targetY = -(maxScroll > 0 ? scrollY / maxScroll : 0) * 5;

    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1);
    });
}

function MouseLight()
{
  const lightRef = useRef();
  const { viewport } = useThree();

  useFrame((state)=>{
    if(lightRef.current)
    {
      const mouseX = (state.pointer.x * viewport.width) / 2
      const mouseY = (state.pointer.y * viewport.height) / 2
      const camX = state.camera.position.x
      const camY = state.camera.position.y
      lightRef.current.position.set(camX + mouseX, camY + mouseY, 2)
    }
  });

  return <pointLight ref={lightRef} color="#ffffff" intensity={3.0} decay={1.5} />
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
      scale={isClicked ? 1.5 : 1}>
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
const [activeSection, setActiveSection] = useState('Home');
const skillsData = [
  { name: "C++", file: "C++_Logo", color: "#00599C" },
  { name: "C", file: "C_Logo", color: "#00599C" },
  { name: "C#", file: "CSharp_Logo", color: "#36058F" },
  { name: "VS 2022", file: "Visual_Studio_2022_Logo", color: "#5C2D91" },
  { name: "Git", file: "Git_Logo", color: "#F05032" },
  { name: "GitHub", file: "GitHub_Logo", color: "#000000" },
  { name: "Unity", file: "Unity_Logo", color: "#000000" },
  { name: "HTML", file: "HTML5_Logo", color: "#E34C26" },
  { name: "JavaScript", file: "JavaScript_Logo", color: "#F7DF1E" },
  { name: "CSS", file: "CSS_Logo", color: "#623094" },
  { name: "Firebase", file: "Firebase_icon", color: "#FFCA28" },
  { name: "React", file: "React_Logo", color: "#61DAFB" },
  { name: "Vite", file: "Vitejs_Logo", color: "#646CFF" },
];

  useEffect(()=>{
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      const projSt = document.getElementById('Section-Projects');
      const eduSt = document.getElementById('Section-Education');

      if(!projSt || !eduSt) return;
      if (scrollPosition >= eduSt.offsetTop) 
      { setActiveSection('Education'); }
      else if (scrollPosition >= projSt.offsetTop)
      {setActiveSection('Projects');}
      else {setActiveSection('Home');}
    };

    window.addEventListener('scroll', handleScroll);

    return() => window.removeEventListener('scroll', handleScroll);}, []
  );
  
  return (
    <>
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%'}}>
    <Canvas eventSource={document.body} eventPrefix="client">
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.05} />
      <MouseLight />
      {/*
      <CameraControls />
      <CubeSpawner count={100}/>
      */}
      <mesh
        position={[0,0,-1]}
        scale={[100,100,100]}>
        <planeGeometry/>
        <meshStandardMaterial color ={"lightcyan"} />
      </mesh>
    </Canvas>
    </div>
    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', color: 'black', zIndex:1}}>
      <div id="Banner" style={{backgroundImage:`url(${GetImgURL('Banner', 'png')})`}}>
        <div id="HeaderPadding">
          <h1 id="NamePlate">Rainne Won Yu Xuan</h1>
          <div>
            <span className="ProfileDescriptor">SG</span>
            <span className="ProfileDescriptor">Aspiring Software Engineer</span>
          </div>
        </div>
      </div>
      <div id="NavBar">
        <div id="NavBarLeft">
            <a onClick={TopFunc} style={{cursor: 'pointer'}} className={`NavBarContent ${activeSection === 'Home' ? 'ActiveNav' : ''}`}>Home</a>
            <a href="#Section-Projects" className={`NavBarContent ${activeSection === 'Projects' ? 'ActiveNav' : ''}`}>Projects</a>
            <a href="#Section-Education" className={`NavBarContent ${activeSection === 'Education' ? 'ActiveNav' : ''}`}>Education</a>
        </div>
        <div id="NavFiller"> </div>
        <div id="NavBarRight">
          <a href="https://docs.google.com/document/d/1QfC2olSZ9923-Cpse7TqSlkwatH6_WKYCVUniSZYd8w" target="_blank"><img src={GetLogoURL('Resume_ico', 'png')} alt="Resume " /></a>
          <a href="https://ra-ivl.itch.io/" target="_blank"><img src={GetLogoURL('Itchio_ico', 'png')} alt=" itch.io " /></a>
          <a href="https://www.linkedin.com/in/rainnyu/" target="_blank"><img src={GetLogoURL("Linkedin_ico", "png")} alt=" LinkedIn" /></a>
        </div>
      </div>

      <div id="BodyPadding">
      <div id="home">
        <div id="fullHome">
          <div className="homeContent">
            <h2>About Me</h2>
            <div className="lineBreak"></div>
            <h4>Game development student @ SIT in Real-Time Interactive Simulation Degree. </h4>
            <h4>Looking for a 1 year credit-brearing Internship</h4>
            <br/>
            <Canvas eventSource={document.body} eventPrefix="client">
              <color attach="background" args={['black']} />
              <CameraControls />
              <directionalLight position={[0, 0, 1]} intensity={1.0}/>
              <Center top left>
                <Text3D font={fontURL} size={0.75}>
                  {"Peko"}
                  <meshStandardMaterial/>
                </Text3D>
              </Center>
            </Canvas>
            <br/>
            <h2>Skills</h2>
            <div className="lineBreak"></div>
            <div className="SkillsRow">
              {skillsData.map((skill, index) => (
                <div key={index} className="SkillItem" style={{ "--hover-color": skill.color }}>
                  <img 
                    src={GetLogoURL(skill.file, 'png')} 
                    alt={`${skill.name} Logo`} 
                  />
                  <p>{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="homeContent" id="Section-Projects">
            <h2>Projects</h2>
            <p>
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              End of Line.
            </p>
          </div>
          <div className="homeContent" id="Section-Education">
            <h2>Education</h2>
            <h3>Digipen Institute of Technology - Real Time Interactive Simulation GPA: 4.7</h3>
            <h4>Provost List 2024</h4>
            <p>Worked as a Teaching Assistant from Fall 2024 to Present</p>
          </div>
          <p>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          </p>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

export default App
