import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";

const PASSWORD = "ChangeThis"; // <-- edit this
const SESSION_COOKIE = "lm_session";
const PORT = 8080;

const app = express();
app.use(helmet({ contentSecurityPolicy:false }));
app.use(express.urlencoded({ extended:false }));
app.use(express.json());
app.use(cookieParser());

// Simple auth check
function requireAuth(req,res,next){
  if(req.cookies?.[SESSION_COOKIE] !== "ok"){
    if(req.path.startsWith("/v1")) return res.status(401).send("Unauthorized");
    return res.redirect("/login");
  }
  next();
}

// Login form
app.get("/login",(req,res)=>{
  res.type("html").send(`
    <h3>Login</h3>
    <form method="POST" action="/login">
      <input name="password" type="password" placeholder="Password">
      <button>Enter</button>
    </form>
  `);
});

// Handle login
app.post("/login",(req,res)=>{
  if((req.body?.password||"")!==PASSWORD) return res.status(401).send("Nope");
  res.cookie(SESSION_COOKIE,"ok",{httpOnly:true,sameSite:"lax",secure:false});
  res.redirect("/");
});

// Serve your html
app.get("/", requireAuth, (req,res)=>{
  res.sendFile(process.cwd()+"/index.html");
});

// Proxy API calls to LM Studio
app.use("/v1", requireAuth, createProxyMiddleware({
  target:"http://127.0.0.1:1234",
  changeOrigin:false,
  ws:true
}));

app.listen(PORT,()=>console.log("Ready on http://localhost:"+PORT));
