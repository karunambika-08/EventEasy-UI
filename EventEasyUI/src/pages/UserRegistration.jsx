// Packages and hooks
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserRegistration.css';
//Images and utils
import welcomeIcon from  '../assets/welcome.svg'
import loginIcon from  '../assets/login.svg'
import { FaCheck, FaInfoCircle, FaLock, FaMailchimp, FaTimes , FaUserAlt, FaUserCircle } from 'react-icons/fa'

// Component
import Header from '../components/Header'
import { Toast } from '../utils/Notify';




// Signin and Signup pages
 function UserRegistration() {
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,24}$/;
  try {
  const [isLoginMode, setLoginMode] = useState(true)
  // const [toggle , setToggle] = useState(true)
  const navigate = useNavigate()
  const userRef = useRef()
  const errRef = useRef();
  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  // const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchpwd, setMatchPwd] = useState('')
  const [validMatchPwd, setValidMatchPwd] = useState(false);
  const [MatchPwdFocus, setMatchPwdFocus] = useState(false);
  const [userType, setUserType] = useState('attendee');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
  
    console.log(userRef.current)
    userRef.current.focus();

  }, [])

  useEffect(() => {
    const result = usernameRegex.test(user)
    setValidName(result)
  }, [user])

  useEffect(() => {
    const result = email
   
    setValidEmail(result)
  }, [email])

  useEffect(() => {
    const result = passwordRegex.test(pwd)
    setValidPwd(result);
    const match = pwd === matchpwd
    setValidMatchPwd(match)
  }, [pwd, matchpwd])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd, matchpwd])

  useEffect(() => {
    setErrMsg('')
  }, [success])

  useEffect(() => {
    
    if (errMsg) {
      errRef.current.focus();
    }
  }, [errMsg]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = usernameRegex.test(user);
    const v2 = passwordRegex.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry")
      return;
    }
    try {
      let userDetails = {
        userName: user
        , email: email
        , password: pwd
        , type: userType
      };
      await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         

        },
        body: JSON.stringify(userDetails),
       
      }).then(async (response) => {
        let jsonData = await response.json()
       
        if (response.status === 201) {
          setSuccess(true)
          setTimeout(()=>{
            localStorage.setItem("currentUser", JSON.stringify(jsonData.userId));
            localStorage.setItem("userDetails", JSON.stringify({username : user , userId : jsonData.userId}));
            console.log("userTyoe", userType);
              if (userType === "eventsOwner") {
               
                 Toast.fire({
                  icon: 'success',
                  iconColor: 'success',
                  title: 'Logged in Successfully as Events Owner',
                })
                navigate("/owner/dashboard");
              } else {
                Toast.fire({
                  icon: 'success',
                  iconColor: 'success',
                  title: 'Logged in Successfully as Attendee',
                })
                navigate("/user/appointments");
              }
              setLoginMode(true)
              setEmail('')
              setUser('')
              setPwd('')
              setMatchPwd('')
          }, 3000)
         
        }
        if (response.status === 409) {
          setErrMsg("User Already Registered, Please Sign In")
          errRef.current.focus();
        }

      }).catch((err) => {
        console.log("Error", err)
      })

    }
    catch (err) {
      console.log("Comming in error");

      if (!err?.response) {
        setErrMsg('No Server Response')
      }
      else {
        console.log("Error", err)
      }
      errRef.current.focus()
    }
  }


  // SignIn api call
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      // Send authentication request to server
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: pwd
        }) 
      });
      const data = await response.json();
      if (!(response.status === 200)) {
        setErrMsg("Invalid Email or Password")
        return
      }
      else if (response.status === 200 && (Object.keys(data.userDetails).length == 0 || data.userDetails === undefined)) {
        setErrMsg("Please enter a valid email or Try Signing up")
        return
      }

      let userInfo = data.userDetails;
      if (userInfo) {
        localStorage.setItem("currentUser", JSON.stringify(userInfo.userId));
        localStorage.setItem("userDetails", JSON.stringify(userInfo));

        if (userInfo.type === "eventsOwner") {
          Toast.fire({
            icon: 'success',
            iconColor: 'success',
            title: 'Logged in Successfully as Events Owner',
          })
      
          navigate("/owner/dashboard");
        } else {
          Toast.fire({
            icon: 'success',
            iconColor: 'success',
            title: 'Logged in Successfully as Attendee',
          })

          navigate("/user/appointments");
        }
      } else {
        setErrMsg("Invalid Email or Password");
      }


    } catch (error) {
      console.log('Error:', error);
      setErrMsg("Failed to authenticate");
    }
  }
  return (
    <div className='userAuthentication'>
    <Header action='nouserName'></Header>

      <section className={`${"usercontainer"} `} >
        {
          isLoginMode ?
            (
              <section className='signin'>
                <div className={`${"container"} `}>
                  <div className="signinContent">
                   
                    <div className="signinform">
                      <h2 className='formTitle'>Sign In</h2>
                      <form onSubmit={handleSignIn} className="registerForm" id='loginForm' >
                        <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>
                        <div className="formGroup">
                          
                          <input
                            type="email"
                            id='email'
                            ref={userRef}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='off'
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby='emailnote'
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                          />
                          <label htmlFor="email">
                            Email
                          </label>
                          <FaUserAlt  className='input-icon'/>
                        </div>
                        <div className="formGroup">
                         
                          <input
                            type="password"
                            id='password'
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby='pwdnote'
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)} />
                             <label htmlFor="password">
                            Password
                          </label>
                          <FaLock className='input-icon'/>
                        </div>
                        <div className='formButton'></div>
                        <button className='signinbutton' disabled={!validPwd || !validEmail ? true : false} id="signin">Sign In</button>
                      </form>
                    </div>
                  
                  </div>
                </div>
                <div className="userImageContainer signInImage">
                  <h2>Welcome Back</h2>
                 <img className='bannerIcon' src={welcomeIcon} alt="" />
                 <p style={{textAlign: 'center'}}> <h5>New to EventEasy ?</h5> <button className='signinImageLink' onClick={() => setLoginMode(false)}>Sign Up</button></p>
                  </div>
              </section>
            ) : (
              // Signup section
              <section className={"signup"}>
                  <div className="userImageContainer">
                  <h2>Welcome</h2>
                  <img className='bannerIcon' src={loginIcon} alt="" />
                      <p> <h5>One of us ?</h5> <button className="signupImageLink" onClick={() => setLoginMode(true)} id="signup">Sign In</button></p>
                  </div>
                <div className={`${"container"}`}>
                  <div className="userTypeTabs">
                  <div className={`slider ${userType !== 'attendee'  ? "moveslider" : ''}`}></div>
                    <div className="userTypeBtnBox">
                    <button className={userType === 'attendee' ? 'activeUserType' : '' } onClick={() => setUserType('attendee')}>Attendee</button>
                    <button className={userType === 'eventsOwner' ? 'activeUserType' : '' }   onClick={() => setUserType('eventsOwner')}>Events Owner</button>
                    </div>
                  </div>
                  <div className="signupContent">
                    <div className="signupform">
                      {userType === 'attendee' ? <h1 className='formTitle'>Attendee Sign up </h1> : <h1  className='formTitle'>Events Owner Sign Up</h1>}
                      <form onSubmit={handleSubmit} className="registerForm" id='registerForm'>
                        <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>
                        <div className="formGroup">
                          <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                          />
                          <label htmlFor="username">
                            Username
                            <span className={validName ? "valid" : "hide"}>
                              <FaCheck />
                            </span>
                            <span className={validName || !user ? "hide" : "invalid"}>
                              <FaTimes></FaTimes>
                            </span>
                          </label>
                          <FaUserCircle className='input-icon'></FaUserCircle>

                          <p id="uidnote" className={userFocus && user &&
                            !validName ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            Only Alphabets of length 4 to 24 allowed
                          </p>
                        </div>
                        <div className="formGroup">
                         
                          <input
                            type="email"
                            id='email'
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='off'
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby='emailnote'
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                          />
                           <label htmlFor="email">
                            Email
                            <span className={validEmail && email ? "valid" : "hide"}>
                              <FaCheck />
                            </span>
                            <span className={validEmail || !email ? "hide" : "invalid"}>
                              <FaTimes></FaTimes>
                            </span>
                          </label>
                          <FaMailchimp className='input-icon'></FaMailchimp>
                          <p id='emailNote' className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            Please enter a valid Email Id
                          </p>
                        </div>
                        <div className="formGroup">
                        
                          <input
                            type="password"
                            id='password'
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby='pwdnote'
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)} />
                              <label htmlFor="password">
                            Password
                            <span className={validPwd && pwd ? "valid" : "hide"}>
                              <FaCheck />
                            </span>
                            <span className={validPwd || !pwd ? "hide" : "invalid"}>
                              <FaTimes></FaTimes>
                            </span>
                          </label>
                          <FaLock className='input-icon'></FaLock>
                          <p id='pwdnote' className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            Password should be 8 to 24 Characters <br />
                          </p>
                        </div>
                        <div className="formGroup">
                        <input
                              type="password"
                              id='confirm_password'

                              onChange={(e) => setMatchPwd(e.target.value)}
                              required
                              aria-invalid={validMatchPwd ? "false" : "true"}
                              aria-describedby='confirmnoteid'
                              onFocus={() => setMatchPwdFocus(true)}
                              onBlur={() => setMatchPwdFocus(false)} />
                          <label htmlFor="confirm_password">
                            Confirm Password
                            <span className={validMatchPwd && matchpwd ? "valid" : "hide"}>
                              <FaCheck />
                            </span>
                            <span className={validMatchPwd || !matchpwd ? "hide" : "invalid"}>
                              <FaTimes></FaTimes>
                            </span>
                           
                          </label>
                          <FaLock className='input-icon'></FaLock>
                          <p id="confirmnote" className={MatchPwdFocus && !validMatchPwd ? "instructions" : "offscreen"}>
                            <FaInfoCircle /> Input doesn&apos;t match password field
                          </p>
                        </div>
                        <div className="formGroup formButton">
                          <button className='signupbutton' disabled={!validName || !validPwd || !validEmail || !validMatchPwd ? true : false}>Sign Up</button>
                         
                        </div>
                     
                      </form>
                    </div>
                   
                  </div>


                </div>
              
              </section>


            )
        }
      </section>
    </div>
      );
    
  } catch (error) {
    console.log(error);
  }
  

}

export default UserRegistration;

