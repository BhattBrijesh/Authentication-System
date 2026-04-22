import userModel from "../model/user.model.js"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from "../config/config.js"
import sessionModel from "../model/session.model.js"


const JWT_SECRET = config.JWT_SECRET

export async function register(req, res) {
    try {
        const { userName, email, password } = req.body
        const isAlreadyRegister = await userModel.findOne({
            $or: [{ userName },{email},{password}]
        })
        if (isAlreadyRegister) {
            res.status(409).json({
                message:'user name or email already exist   '
            })
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
        
        const user = await userModel.create({
            userName,
            email,
            password: hashedPassword
        })
        
       
     
        const refreshToken = jwt.sign(
            {
            id:user._id,
            },
            JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent:req.headers["user-agent"]

        })
        const accessToken = jwt.sign(
            {
                id: user._id,
                sessionId:session._id
            },
            JWT_SECRET,
            {
                expiresIn: "15min"
            }
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge:7*24*60*60*1000
        })

        res.status(201).json({
            message: "user created successfully",
            user: {
                userName: user.userName,
                email:user.email
            },
            accessToken
        })
        
    } catch (err) {
        throw new Error(err)
    
    }
}

export async function getMe(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message:"token is required"
            })
        }
        const decode = jwt.verify(token, JWT_SECRET)
        const user = await userModel.findById(decode.id)
        if (!user) {
           
            return res.status(400).json({
                message: "user does not found"
            })
        }
        res.status(200).json({
            message: "user fetched successfully",
            user: {
                userName: user.userName,
                email:user.email
            }
        })
    } catch (err) {
        throw new Error(err)
    }
    
}

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({
               message:"Refresh token  not found"
           })
        }
        const decode = jwt.verify(refreshToken, JWT_SECRET)

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked:false
        })
        if (!session) {
            return res.status(401).json({
                message:"Invalid refresh token"
            })
        }


        const accessToken = jwt.sign({
            id:decode.id
        }, JWT_SECRET, {
            expiresIn:'15min'
        })
    
        const newRefreshToken = jwt.sign({
           id:decode.id
        }, JWT_SECRET, {
            expiresIn: '7d'
        })
        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
        session.refreshTokenHash = newRefreshTokenHash
        await session.save()
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        })
    } catch (error) {
        throw new Error(error)
    }
    
}

export async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(400).json({
                message:"Refresh token not found"
            })
        }
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked:false
        })
        if (!session) {
            return res.status(400).json({
                message:"Invalid refresh token"
            })
        }
        session.revoked = true;
        await session.save();
        res.clearCookie("refreshToken")
        res.status(200).json({
            message:"Logout successfully"
        })
    } catch (err) {
        throw new Error(err)
    }
}

export async function logoutAll(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token not found"
            })
        }
        const decode = jwt.verify(refreshToken, JWT_SECRET)
        await sessionModel.updateMany({
            user: decode.id,
            revoked: false
        }, {
            revoked: true
        })
        res.clearCookie('refreshToken')
        res.status(200).json({
            message: "Logged out from all devices successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const hashedPassword = crypto.createHash("sha256").update(password).digest('hex');
        const isPassword = hashedPassword === user.password;
        if (!isPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const refreshToken = jwt.sign({
            id: user._id
        }, JWT_SECRET, {
            expiresIn: "7d"
        })
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })
        const accessToken = jwt.sign({
            id: user._id,
            sessionId: session._id
        }, JWT_SECRET, { expiresIn: "15m" }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Logged in successfully",
            user: {
                userName: user.userName,
                email: user.email
            },
            accessToken
        })
    } catch (error) {
        throw new Error(error)
    }
}
