import { Routes , Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { useEffect, useState } from 'react'
import { getCurrentUser, loginWithFirebaseToken } from './apis/user.api'
import { auth } from './utils/firebase'
import { signOut } from 'firebase/auth'
import Scorer from './pages/Scorer'
import { getResume } from './apis/resume.api'
import { useDispatch } from 'react-redux'
import { setResume } from './redux/resumeSlice'
import ResumeBuilder from './pages/ResumeBuilder'
import InterviewStart from './pages/InterviewStart'
import InterviewPage from './pages/InterviewPage'
import InterviewReport from './pages/InterviewReport'
import Roadmap from './pages/Roadmap'
import Billing from './pages/Billing'

function App() {
  const [user,setUser]= useState(null)
  const [loading , setLoading] = useState(true)
  const dispatch = useDispatch()


  useEffect(()=>{

    const getUser = async () => {
      let data = await getCurrentUser()

      if (!data?.user && auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken()
          data = await loginWithFirebaseToken(token)
        } catch {
          await signOut(auth).catch(() => {})
        }
      }

      setUser(data?.user)
      if (!data?.user) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("sessionId")
        }
        await signOut(auth).catch(() => {})
      }
      setLoading(false)
    }

    getUser()

  },[])

  useEffect(()=>{

    const getResumeData = async()=>{
      if (!user) {
        dispatch(setResume(null))
        return
      }
      const result = await getResume()
      dispatch(setResume(result?.data))
    }

    getResumeData()

  },[dispatch, user])


  if(loading){
    return(
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <div className="h-1 bg-black animate-pulse w-full" />
      </div>
    )
  }

  return (
   <>

   <Routes>
    <Route path='/' element={
      user ? <Navigate to="/dashboard" replace/> : <Home setUser={setUser}/>
      }/>

    <Route path='/dashboard' element={
      user ? <Dashboard user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>

      <Route path='/scorer' element={
      user ? <Scorer user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>

      <Route path='/resume' element={
      user ? <ResumeBuilder user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>

      <Route path='/interview' element={
      user ? <InterviewStart user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>

      <Route path='/interview/:id' element={
      user ? <InterviewPage user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>

      <Route path='/interview/:id/report' element={
      user ? <InterviewReport user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>

      <Route path='/roadmap' element={
      user ? <Roadmap user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>

      <Route path='/billing' element={
      user ? <Billing user={user} setUser={setUser}/> 
      : <Navigate to="/" replace/> }/>


   </Routes>
   </>
  )
}

export default App
