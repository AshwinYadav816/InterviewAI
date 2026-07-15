import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import Loader from '../../../components/Loader'

const Register = () => {

    const { user, loading, handleRegister } = useAuth()
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")
    const [ submitting, setSubmitting ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            await handleRegister({username,email,password})
            navigate("/home")
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    // Already logged in? Skip the auth pages and go straight in.
    if(user){
        return <Navigate to="/home" replace />
    }

    if(loading){
        return <Loader message="Just a moment" subtitle="Preparing your account" />
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {error && <p className="form-error" role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' autoComplete="nickname" placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' autoComplete="username" placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' autoComplete="new-password" placeholder='Enter password' />
                    </div>

                    <button className='button primary-button' disabled={submitting} >
                        {submitting ? 'Registering...' : 'Register'}
                    </button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register