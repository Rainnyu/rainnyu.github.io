import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import { Text3D, Center } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"
import './App.css'

import fontPath from '../assets/Fonts/helvetiker_regular.typeface.json'

const PHRASES = ["Peko", "Hello", "world!", "DvD", `#404`];
const COLORS = ["beeeeef", "#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"];

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
const projectsData = [
  { 
    title: "Custom 2D Game Engine", 
    desc: "A C++ game engine from scratch\nHandled the entire rendering pipeline using techniques such as\nDeferred Shading, Order Independent Transparancy, Batching and Instancing\nFeatured in Mid-Autumn Festival 2025 @ West Coast.", 
    tags: ["C++", "OpenGL", "GLSL"],
    image: "SugarStrike_Home", // You need to add these images to your assets!
    link: "https://github.com/Gideonnf/TeamCarmicah" 
  },
  { 
    title: "Global Game Jam 2024", 
    desc: "A 3D game w/ multiplayer PvP made for Global Game Jam using Unity.\nHandled the maze generation and coordination with artist to import assets.", 
    tags: ["Unity", "C#"],
    image: "BuffBoaties_Tumbnail",
    link: "https://gideonnf.itch.io/cuties-buffies"
  },
  { 
    title: "This website!", 
    desc: "A very real thing\nTrust me! It's real", 
    tags: ["Html", "CSS", "JavaScript", "React", "Three.js", "Vite"],
    image: "Banner",
    link: "https://rainnyu.github.io/"
  }
];
const educationData = [
  {
    school: "DigiPen Institute of Technology Singapore",
    degree: "B.Sc in Computer Science in Real-Time Interactive Simulation",
    year: "2023 - Present",
    gpa: "GPA: 4.7",
    desc: [
      "Provost List 2024"
    ]
  }
];
const workData = [
  {
    company: "Digipen Institute of Technology Singapore",
    role: "Teaching Assistant",
    period: "Sep 2024 - Present",
    desc: [
      "Helped students with coding assignments and projects for various programming modules.",
      "Explained complex programming concepts in an easy-to-understand manner."
    ],
    techStack: ["C", "C++", "OpenGL", "Unity", "C#"]
  },
  {
    company: "Cacani",
    role: "Student Developer (Part Time)",
    period: "May 2024 - Aug 2024",
    desc: [
      "Work on detection of line segment encapsulation to sovlve closed shape detection issues.",
      "Implemented curved line selection between line vectors for better user experience."
    ],
    techStack: ["C++", "Qt"]
  }
];

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
    const targetY = -(maxScroll > 0 ? scrollY / maxScroll : 0) * 10;

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

function BouncingText({fontPath})
{
  const ref = useRef();
  const {viewport} = useThree();

  const [textIndex, setTextIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const vel = useRef([0.025 + Math.random() * 0.025, 0.025 + Math.random() * 0.025]);

  useFrame(() =>{
    if(!ref.current) return;
    
    const mesh = ref.current;
    mesh.position.x += vel.current[0];
    mesh.position.y += vel.current[1];
    // X-Axis Collision
    if (mesh.position.x > viewport.width / 2 - 2.5 || mesh.position.x < -viewport.width / 2 + 2.5) {
      vel.current[0] = -vel.current[0]; // FIX: Change velocity -> vel
      mesh.position.x = Math.sign(mesh.position.x) * (viewport.width / 2 - 2.5 - 0.1);
      handleCollision();
    }
    // Y-Axis Collision
    if (mesh.position.y > viewport.height / 2 - 0.5 || mesh.position.y < -viewport.height / 2 + 0.5) {
      vel.current[1] = -vel.current[1]; // FIX: Change velocity -> vel
      mesh.position.y = Math.sign(mesh.position.y) * (viewport.height / 2 - 0.5 - 0.1);
      handleCollision();
    }
  });
  const handleCollision = () => {
    // Pick a random index that isn't the current one
    let nextText = Math.floor(Math.random() * PHRASES.length);
    if(nextText === textIndex) nextText = (textIndex + 1) % PHRASES.length;

    // Pick a new color (different from current)
    let nextColor = Math.floor(Math.random() * COLORS.length);
    if(nextColor === colorIndex) nextColor = (colorIndex + 1) % COLORS.length;

    setTextIndex(nextText);
    setColorIndex(nextColor);
  };
  return(
    <group ref={ref}>
      <Center>
        <Text3D font={fontPath} size={0.75} height={0.2} curveSegments={12}>
          {PHRASES[textIndex]}
          <meshStandardMaterial color={COLORS[colorIndex]} />
        </Text3D>
      </Center>
    </group>
  );
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

function App() {
const [activeSection, setActiveSection] = useState('Home');

  useEffect(()=>{
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      const projSt = document.getElementById('Section-Projects');
      const eduSt = document.getElementById('Section-Education');
      const workSt = document.getElementById('Section-Work');

      if(!projSt || !eduSt || !workSt) return;
      if (scrollPosition >= workSt.offsetTop) 
      { setActiveSection('Work'); }
      else if (scrollPosition >= eduSt.offsetTop) 
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
    <Canvas eventSource={document.body} eventPrefix="client" dpr={[1, 1]}>
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
            <a href="#Section-Work" className={`NavBarContent ${activeSection === 'Work' ? 'ActiveNav' : ''}`}>Work</a>
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
            <div className="TxtCenter">  
              <h4>Game development student @ SIT in Real-Time Interactive Simulation Degree. </h4>
              <h4>Looking for a 1 year credit-brearing Internship</h4>
            </div>
            <br/>
            <Canvas eventSource={document.body} eventPrefix="client" style={{width: '100%', height: '350px'}}>
              <color attach="background" args={['black']} />
              {/*
              <CameraControls />
              */}
              <directionalLight position={[0, 0, 1]} intensity={1.0}/>
              <BouncingText fontPath={fontPath} />
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
            <div className="lineBreak"></div>
            <div className="ProjectsGrid">
              {projectsData.map((project, index) => {
                const isEven = index % 2 === 0;
                return(
                  <motion.div key={index} className={`ProjCard ${isEven ? 'ProjCardRev' : ''}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{opacity: 1, y: 0}}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    viewport={{once:false, amount:0.1, margin: "-100px 0px 0px 0px"}}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                    <div className="ProjCardImg">
                      <img src={GetImgURL(project.image, 'png')} alt={`${project.title} Thumbnail`} />
                    </div>
                    <div className="ProjCardContent">
                      <h3>{project.title}</h3>
                      <p>{project.desc}</p>
                      <div className={`ProjCardTags ${isEven ? 'ProjCardRev' : ''}`}>
                        {project.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="ProjTag">{tag}</span>
                        ))}
                      </div>
                      <a href={project.link} target="_blank" className="ProjCardLink">View Project</a>
                    </div>
                  </motion.div>
                )})}
            </div>
          </div>
          <div className="homeContent" id="Section-Education">
            <h2>Education</h2>
            <div className="lineBreak"></div>
            <div className="TimelineContainer">
              {educationData.map((item, index) => (
                <div key={index} className="TimelineItem">
                  <div className="TimelineDot"></div>

                  <div className="TimelineContent">
                    <div className="TimelineData">{item.year}</div>
                    <h3>{item.school}</h3>
                    <h4>{item.degree}</h4>
                    <span className="TimelineGPA">{item.gpa}</span>
                    <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                      {item.desc.map((point, pointIndex) => (
                        <li key={pointIndex} className="TimelineListItem">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <br /> <br />
          </div>
          <div className="homeContent" id="Section-Work">
            <h2>Work</h2>
            <div className="lineBreak"></div>
            <div className="TimelineContainer">
              {workData.map((item, index) => (
                <div key={index} className="TimelineItem">
                  <div className="TimelineDot"></div>

                  <div className="TimelineContent">
                    <div className="TimelineData">{item.period}</div>
                    <h3>{item.company}</h3>
                    <h4>{item.role}</h4>
                    <div className="ProjCardTags">
                        {item.techStack.map((tag, tagIndex) => (
                          <span key={tagIndex} className="ProjTag">{tag}</span>
                        ))}
                    </div>
                    <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                      {item.desc.map((point, pointIndex) => (
                        <li key={pointIndex} className="TimelineListItem">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <div className="TxtCenter">
            <p style={{color: 'white'}}>Thx for scrolling to the end :)</p>
            <p style={{color: 'white'}}>Contact me: t.rainii375@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

export default App
