"use client"

import type React from "react"
import { Text } from "@react-three/drei";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  Briefcase,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { motion, useScroll, useInView, useAnimation, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Line } from "@react-three/drei"
import type * as THREE from "three"
import { Vector3 } from "three"
import { JSX } from "react/jsx-runtime"

// Define types for our components
interface QuizQuestionProps {
  question: string
  options: Array<string | QuizOption>
  columns?: number
}

interface QuizOption {
  icon: React.ReactNode
  label: string
  color: string
}

interface CareerPathProps {
  path: {
    icon: React.ReactNode
    title: string
    color: string
  }
  index: number
}

interface CourseCardProps {
  course: {
    image: string
    category: string
    title: string
    description: string
    duration: string
    rating: string
  }
  index: number
}

interface TestimonialType {
  name: string
  role: string
  image: string
  text: string
  tags: string[]
}

interface FaqItemProps {
  question: string
  answer: string
}

// 3D Career Path Line Graph
const CareerPathGraph: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const nodeRefs = useRef<THREE.Mesh[]>([])

  // Career path points (representing career progression)
  const pathPoints = [
    new Vector3(-5, -2, 0), // Starting point
    new Vector3(-3, -1, 1), // Early career
    new Vector3(-1, 0, 0), // Mid-level
    new Vector3(1, 1, -1), // Senior level
    new Vector3(3, 2, 0), // Management
    new Vector3(5, 3, 1), // Leadership
  ]

  // Career milestones/nodes
  const nodes = [
    { position: pathPoints[0], label: "Entry", color: "#c084fc" },
    { position: pathPoints[1], label: "Junior", color: "#a855f7" },
    { position: pathPoints[2], label: "Mid-level", color: "#8b5cf6" },
    { position: pathPoints[3], label: "Senior", color: "#7c3aed" },
    { position: pathPoints[4], label: "Lead", color: "#6d28d9" },
    { position: pathPoints[5], label: "Executive", color: "#5b21b6" },
  ]

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle rotation of the entire graph
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2

      // Animate nodes
      nodeRefs.current.forEach((node, i) => {
        if (node) {
          // Make nodes float up and down slightly
          node.position.y = nodes[i].position.y + Math.sin(clock.getElapsedTime() * 0.5 + i) * 0.1
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Career path line */}
      <Line points={pathPoints} color="#a855f7" lineWidth={5} dashed={false} />

      {/* Career milestone nodes */}
      {nodes.map((node, index) => (
        <mesh
          key={index}
          position={node.position}
          ref={(el) => {
            if (el) nodeRefs.current[index] = el
          }}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={node.color} />

          {/* Text label for each node */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color={node.color} opacity={0} transparent />
          </mesh>
        </mesh>
      ))}

      {/* HireFusion branding */}
      <mesh position={[0, -3, 0]}>
        <Text
          fontSize={0.5}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          HireFusion
        </Text>

      </mesh>
    </group>
  )
}

const Scene3D: React.FC = () => {
  return (
    <Canvas style={{ height: "100%", width: "100%" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CareerPathGraph />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}

// Micro-interaction components
const MicroButton: React.FC<{
  children: React.ReactNode
  className?: string
  onClick?: () => void
}> = ({ children, className = "", onClick }) => {
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.span
        className="absolute inset-0 bg-white bg-opacity-20"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.5, opacity: 0.3 }}
        transition={{ duration: 0.4 }}
        style={{ originX: 0.5, originY: 0.5 }}
      />
      {children}
    </motion.button>
  )
}

const MicroLink: React.FC<{
  href: string
  children: React.ReactNode
  className?: string
}> = ({ href, children, className = "" }) => {
  return (
    <Link href={href}>
      <motion.span
        className={`inline-block ${className}`}
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.span>
    </Link>
  )
}

// QuizQuestion Component
function QuizQuestion({ question, options, columns = 1 }: QuizQuestionProps): JSX.Element {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <label className="block text-xl font-bold text-gray-800 mb-4">{question}</label>
      <div
        className={`grid grid-cols-1 ${columns === 2 ? "md:grid-cols-2" : columns === 3 ? "md:grid-cols-3" : ""} gap-4`}
      >
        {options.map((option, index) => (
          <motion.button
            key={typeof option === "object" ? option.label : option}
            className={`p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 ${typeof option === "object" ? "flex items-center" : ""
              }`}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              borderColor:
                typeof option === "object"
                  ? option.color === "purple"
                    ? "#a855f7"
                    : option.color === "blue"
                      ? "#3b82f6"
                      : "#10b981"
                  : "#a855f7",
            }}
            whileTap={{ y: 0, scale: 0.98 }}
          >
            {typeof option === "object" ? (
              <>
                <div
                  className={`w-10 h-10 bg-${option.color}-100 rounded-lg flex items-center justify-center mr-3 shrink-0`}
                >
                  {option.icon}
                </div>
                <span className="text-gray-800 font-medium">{option.label}</span>
              </>
            ) : (
              <span className="text-gray-800 font-medium">{option}</span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// CareerPathCard Component
function CareerPathCard({ path, index }: CareerPathProps): JSX.Element {
  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-500"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.1, duration: 0.5 },
        },
      }}
      whileHover={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        y: -10,
      }}
    >
      <div className="h-4 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      <div className="p-8">
        <div
          className={`w-16 h-16 bg-${path.color === "purple" ? "purple" : path.color === "blue" ? "blue" : "green"}-100 rounded-2xl flex items-center justify-center mb-6`}
        >
          {path.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{path.title}</h3>
        <p className="text-gray-600 mb-6">
          {path.title.includes("Design")
            ? "Perfect for creative minds who want to bring visual ideas to life."
            : path.title.includes("Development")
              ? "For those who love coding and building digital solutions."
              : "Ideal for strategic thinkers who want to grow businesses."}
        </p>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <Link href="#" className="text-purple-600 font-medium flex items-center group">
            Explore path
            <ChevronRight className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// CourseCard Component
function CourseCard({ course, index }: CourseCardProps): JSX.Element {
  const categoryColors: Record<string, string> = {
    Design: "purple",
    Development: "blue",
    Marketing: "green",
  }

  const color = categoryColors[course.category] || "purple"

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg overflow-hidden"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.1, duration: 0.5 },
        },
      }}
      whileHover={{
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-56 bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: color === "purple" ? "#f3e8ff" : color === "blue" ? "#dbeafe" : "#dcfce7",
              color: color === "purple" ? "#9333ea" : color === "blue" ? "#2563eb" : "#16a34a",
            }}
          >
            {course.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center text-gray-500 mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{course.duration}</span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
            <span className="text-sm">{course.rating}</span>
          </div>
        </div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <Link href="#" className="text-purple-600 font-medium flex items-center group">
            View course
            <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// TestimonialsSlider Component
function TestimonialsSlider(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const testimonials: TestimonialType[] = [
    {
      name: "Sarah Johnson",
      role: "UX/UI Designer",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop",
      text: "I started as a part-time freelancer with basic design skills. After taking courses and building my portfolio on HireFusion, I now run my own design agency with clients worldwide. The platform's resources and community support were instrumental in my growth.",
      tags: ["UX Design", "Agency Growth", "Portfolio Building"],
    },
    {
      name: "Michael Chen",
      role: "Full-Stack Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      text: "After being laid off, I turned to HireFusion as a temporary solution. The career resources helped me identify my strengths and position myself effectively. Now I earn twice my previous salary working with clients I love.",
      tags: ["Web Development", "Career Transition", "Client Acquisition"],
    },
    {
      name: "Jessica Williams",
      role: "Content Strategist",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
      text: "The templates and proposal guides on HireFusion were game-changers for me. I went from struggling to find clients to having a waitlist within 6 months. The structured approach to freelancing made all the difference.",
      tags: ["Content Strategy", "Client Management", "Pricing Strategy"],
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 p-8 md:p-12 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="md:w-1/4 flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-purple-500">
                <Image
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{testimonials[currentIndex].name}</h3>
              <p className="text-gray-400">{testimonials[currentIndex].role}</p>

              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>

            <div className="md:w-3/4">
              <svg className="h-12 w-12 text-purple-700 opacity-30 mb-4" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              <p className="text-xl leading-relaxed mb-6">{testimonials[currentIndex].text}</p>

              <div className="flex flex-wrap gap-2">
                {testimonials[currentIndex].tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-purple-600" : "bg-gray-700"
              } transition-colors duration-300`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// FaqItem Component
function FaqItem({ question, answer }: FaqItemProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <motion.div
      className="border-b border-gray-200 pb-4"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false, amount: 0.8 }}
    >
      <button
        className="flex justify-between items-center w-full py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <h4 className="text-lg font-bold text-gray-800 flex items-center">
          <HelpCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
          {question}
        </h4>
        <ChevronRight
          className={`h-5 w-5 text-purple-600 transform transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 pb-4 pl-7">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function CareerAdvicePage(): JSX.Element {
  // For gradient animation
  const [gradientPosition, setGradientPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // For parallax effect
  const handleMouseMove = (e: React.MouseEvent): void => {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight
    setGradientPosition({ x, y })
  }

  // For scroll animations
  const controls = useAnimation()
  const { scrollYProgress } = useScroll()

  // Refs for sections to detect when they're in view
  const introRef = useRef<HTMLDivElement>(null)
  const isIntroInView = useInView(introRef, { once: false, amount: 0.3 })

  const pathsRef = useRef<HTMLDivElement>(null)
  const isPathsInView = useInView(pathsRef, { once: false, amount: 0.3 })

  const skillsRef = useRef<HTMLDivElement>(null)
  const isSkillsInView = useInView(skillsRef, { once: false, amount: 0.3 })

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Real images for the page
  const images = {
    hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    intro: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    skill1: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop",
    skill2: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2070&auto=format&fit=crop",
    skill3: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2006&auto=format&fit=crop",
    profile1: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop",
    profile2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    profile3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Header - Interactive Gradient with 3D Elements */}
      <header
        className="relative h-screen flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-600 to-violet-800"
          style={{
            backgroundPosition: `${gradientPosition.x * 100}% ${gradientPosition.y * 100}%`,
            transition: "background-position 0.5s ease-out",
          }}
        >
          <div
            className="absolute inset-0 bg-center bg-cover mix-blend-overlay opacity-10"
            style={{ backgroundImage: `url(${images.hero})` }}
          ></div>
        </div>

        <div className="absolute inset-0 z-10 opacity-70">
          <Scene3D />
        </div>

        <motion.div
          className="relative z-20 max-w-7xl mx-auto px-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            HireFusion
            <span className="block text-3xl md:text-5xl mt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-yellow-200">
              Career Pathway Hub
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto text-white text-opacity-90 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Whether you're just starting out or looking to level up, our expert advice, resources, and tools will help
            you navigate your career journey with confidence.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="#explore">
              <MicroButton className="px-8 py-4 bg-white text-purple-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300">
                Start Your Journey
              </MicroButton>
            </Link>
            <Link href="#resources">
              <MicroButton className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-10 transform transition-all duration-300">
                Explore Resources
              </MicroButton>
            </Link>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: [0, 10, 0], opacity: 1 }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" },
              opacity: { delay: 1.2, duration: 0.8 },
            }}
          >
            <Link href="#intro">
              <div className="rounded-full p-2 bg-white bg-opacity-20 backdrop-blur-sm cursor-pointer">
                <ChevronRight className="h-6 w-6 text-white transform rotate-90" />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* Introduction Section */}
      <section id="intro" className="py-24 px-6" ref={introRef}>
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate={isIntroInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div className="lg:w-1/2" variants={fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 relative">
                <span className="relative inline-block">
                  Build Your Dream Career
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  ></motion.span>
                </span>
                <span className="block mt-2">One Step at a Time</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                HireFusion's Career Pathway Hub is here to guide you on your professional journey. Whether you're
                looking for job opportunities, skill development, or tips to grow your career, we have everything you
                need.
              </p>
              <p className="text-xl text-gray-600 mb-8">
                Get expert advice, resources, and actionable steps that will help you succeed in your career, no matter
                where you are starting from.
              </p>

              <motion.div
                className="flex flex-wrap gap-3 mb-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {["Beginner", "Intermediate", "Expert"].map((level, index) => (
                  <motion.span
                    key={level}
                    className="px-6 py-3 rounded-full font-medium text-lg transform hover:scale-105 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${index === 0 ? "#c084fc, #a855f7" : index === 1 ? "#60a5fa, #3b82f6" : "#818cf8, #6366f1"
                        })`,
                      color: "white",
                    }}
                    variants={cardVariant}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    {level}
                  </motion.span>
                ))}
              </motion.div>

              <MicroButton className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg flex items-center transform transition-all duration-300">
                Explore Resources <ChevronRight className="ml-2 h-5 w-5" />
              </MicroButton>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              variants={fadeIn}
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-r from-purple-300 to-indigo-300 rounded-2xl"></div>
                <Image
                  src={images.intro || "/placeholder.svg"}
                  alt="Career growth illustration"
                  width={700}
                  height={600}
                  className="rounded-2xl shadow-xl relative z-10 object-cover"
                />
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg z-20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                      ))}
                    </div>
                    <div className="text-gray-800 font-bold">
                      500+ <span className="text-gray-500 font-normal">Success Stories</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Personalized Career Paths */}
      <section id="explore" className="py-24 px-6 bg-gradient-to-b from-white to-indigo-50" ref={pathsRef}>
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate={isPathsInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <motion.span
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium inline-block mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              FIND YOUR PATH
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Discover the Path That's Right for You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take our quick career assessment to find out where you can go next. Based on your skills, goals, and
              interests, we'll guide you to the best career paths on HireFusion.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16"
            variants={fadeIn}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Career Assessment Quiz</h3>
              </div>

              <div className="space-y-8">
                <QuizQuestion
                  question="What's your current experience level?"
                  options={["Beginner (0-2 years)", "Intermediate (3-5 years)", "Expert (6+ years)"]}
                />

                <QuizQuestion
                  question="Which skills are you most interested in developing?"
                  options={[
                    {
                      icon: <FileText className="h-5 w-5 text-purple-600" />,
                      label: "Content Writing",
                      color: "purple",
                    },
                    {
                      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
                      label: "Business Strategy",
                      color: "blue",
                    },
                    {
                      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
                      label: "Digital Marketing",
                      color: "green",
                    },
                  ]}
                />

                <QuizQuestion
                  question="What are your career goals?"
                  options={[
                    "Become a full-time professional",
                    "Supplement my income with part-time work",
                    "Build a business or agency",
                    "Develop new skills for my current job",
                  ]}
                  columns={2}
                />
              </div>

              <MicroButton className="mt-10 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center mx-auto">
                Get Personalized Recommendations
              </MicroButton>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer}>
            {[
              {
                icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
                title: "Design Career Path",
                color: "purple",
              },
              {
                icon: <Briefcase className="h-6 w-6 text-blue-600" />,
                title: "Development Career Path",
                color: "blue",
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-green-600" />,
                title: "Marketing Career Path",
                color: "green",
              },
            ].map((path, index) => (
              <CareerPathCard key={path.title} path={path} index={index} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Skill Development Tips */}
      <section id="resources" className="py-24 px-6" ref={skillsRef}>
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate={isSkillsInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <motion.span
              className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium inline-block mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              SKILL DEVELOPMENT
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Stay Ahead of the Curve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The job market is always evolving, and so should your skills. Learn the latest trends in the industry and
              the top skills employers are looking for on HireFusion.
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
            {[
              {
                image: images.skill1,
                category: "Design",
                title: "UX/UI Design Fundamentals",
                description:
                  "Learn the principles of user-centered design and create intuitive interfaces that users love.",
                duration: "8 weeks",
                rating: "4.8 (245 reviews)",
              },
              {
                image: images.skill2,
                category: "Development",
                title: "Python for Data Science",
                description:
                  "Master Python programming and learn how to analyze data, create visualizations, and build models.",
                duration: "10 weeks",
                rating: "4.9 (312 reviews)",
              },
              {
                image: images.skill3,
                category: "Marketing",
                title: "Digital Marketing Strategy",
                description: "Learn how to create effective marketing campaigns across multiple digital channels.",
                duration: "6 weeks",
                rating: "4.7 (189 reviews)",
              },
            ].map((course, index) => (
              <CourseCard key={course.title} course={course} index={index} />
            ))}
          </motion.div>

          <motion.div className="mt-16 text-center" variants={fadeIn}>
            <MicroButton className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg flex items-center mx-auto">
              Browse All Courses <ChevronRight className="ml-2 h-5 w-5" />
            </MicroButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.span
              className="px-4 py-2 bg-purple-900 text-purple-200 rounded-full text-sm font-medium inline-block mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              SUCCESS STORIES
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Real Stories, Real Success</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get inspired by how others have achieved success on HireFusion and the strategies they used to reach their
              goals.
            </p>
          </motion.div>

          <TestimonialsSlider />
        </div>
      </section>

      {/* FAQ & Newsletter */}
      <section className="py-24 px-6 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <FaqItem
                  question="How do I find my first job on HireFusion?"
                  answer="Start by creating a strong profile, uploading your portfolio, using our advanced search filters, and setting up job alerts that match your skills and experience level."
                />
                <FaqItem
                  question="How much should I charge as a beginner?"
                  answer="Research market rates for your skill level, consider your expenses, and start slightly below average to attract clients. Raise your rates as you gain experience and positive reviews."
                />
                <FaqItem
                  question="How do I stand out from other candidates?"
                  answer="Customize your application for each job, highlight relevant experience, create a compelling portfolio that showcases your best work, and demonstrate your understanding of the company's needs in your cover letter."
                />
                <FaqItem
                  question="How do I prepare for interviews through HireFusion?"
                  answer="Research the company thoroughly, practice common interview questions in your field, prepare examples of your past work, and use our Interview Prep feature that provides industry-specific guidance and mock interviews."
                />
              </div>

              <motion.button
                className="mt-8 text-purple-600 font-bold flex items-center"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                View all FAQs <ChevronRight className="ml-1 h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Join Our Newsletter</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Get weekly tips, job opportunities, and industry insights delivered straight to your inbox. Stay
                  informed and ahead of the curve with HireFusion.
                </p>

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-full border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
                  />
                  <MicroButton className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold">
                    Subscribe
                  </MicroButton>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Join <span className="font-bold text-gray-800">5,000+</span> subscribers
                  </p>
                </div>
              </div>

              <motion.div
                className="mt-12 p-8 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl shadow-xl text-white"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Community Support</h3>
                </div>
                <p className="mb-6">
                  Join our community of professionals to connect, learn, and grow together. Get advice, share
                  experiences, and find collaboration opportunities on HireFusion.
                </p>
                <MicroButton className="px-6 py-3 bg-white text-purple-700 rounded-full font-bold text-lg flex items-center">
                  Join Community <ChevronRight className="ml-2 h-5 w-5" />
                </MicroButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Start Building Your Future Today</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            You've got the tools, now it's time to act. Use HireFusion's resources, set your goals, and start your
            career journey with confidence!
          </p>

          <MicroButton className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-xl shadow-xl inline-flex items-center">
            Begin Your Journey <ChevronRight className="ml-2 h-6 w-6" />
          </MicroButton>

          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            {["5,000+ Success Stories", "24/7 Support", "Free Resources", "Expert Guidance"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <span className="text-gray-600 font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">HireFusion</h3>
              <p className="text-gray-400 mb-6">
                Empowering professionals to build successful careers through expert guidance and resources.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "Instagram", "YouTube"].map((social) => (
                  <Link href="#" key={social}>
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors duration-300">
                      <span className="sr-only">{social}</span>
                      <div className="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Resources</h4>
              <ul className="space-y-4">
                {["Blog", "Guides", "Templates", "Webinars", "Podcast"].map((item) => (
                  <li key={item}>
                    <MicroLink href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </MicroLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Career Paths</h4>
              <ul className="space-y-4">
                {["Design", "Development", "Marketing", "Writing", "Consulting"].map((item) => (
                  <li key={item}>
                    <MicroLink href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </MicroLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                {["About Us", "Our Team", "Careers", "Contact", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <MicroLink href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </MicroLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} HireFusion. All rights reserved.</p>
            <div className="flex space-x-6">
              <MicroLink href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms
              </MicroLink>
              <MicroLink href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy
              </MicroLink>
              <MicroLink href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookies
              </MicroLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
