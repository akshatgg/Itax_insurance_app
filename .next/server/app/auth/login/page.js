(()=>{var e={};e.id=859,e.ids=[859],e.modules={2952:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>o.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>d});var s=r(65239),a=r(48088),i=r(88170),o=r.n(i),n=r(30893),l={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);r.d(t,l);let d={children:["",{children:["auth",{children:["login",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,81804)),"/home/akshatgg/projects/Itax_insurance_app/app/auth/login/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,8179)),"/home/akshatgg/projects/Itax_insurance_app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,65284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,c=["/home/akshatgg/projects/Itax_insurance_app/app/auth/login/page.tsx"],u={require:r,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/auth/login/page",pathname:"/auth/login",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},16189:(e,t,r)=>{"use strict";var s=r(65773);r.o(s,"useRouter")&&r.d(t,{useRouter:function(){return s.useRouter}})},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},19771:e=>{"use strict";e.exports=require("process")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},35078:(e,t,r)=>{Promise.resolve().then(r.bind(r,81804))},37366:e=>{"use strict";e.exports=require("dns")},37590:(e,t,r)=>{"use strict";r.d(t,{Ay:()=>K,oR:()=>L});var s,a=r(43210);let i={data:""},o=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||i,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,c=(e,t)=>{let r="",s="",a="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+o+";":s+="f"==i[1]?c(o,i):i+"{"+c(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=c(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=c.p?c.p(i,o):i+":"+o+";")}return r+(t&&a?t+"{"+a+"}":a)+s},u={},p=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+p(e[r]);return t}return e},m=(e,t,r,s,a)=>{let i=p(e),o=u[i]||(u[i]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(i));if(!u[o]){let t=i!==e?e:(e=>{let t,r,s=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?s.shift():t[3]?(r=t[3].replace(d," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(d," ").trim();return s[0]})(e);u[o]=c(a?{["@keyframes "+o]:t}:t,r?"":"."+o)}let m=r&&u.g?u.g:null;return r&&(u.g=u[o]),((e,t,r,s)=>{s?t.data=t.data.replace(s,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(u[o],t,s,m),o},g=(e,t,r)=>e.reduce((e,s,a)=>{let i=t[a];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"");function x(e){let t=this||{},r=e.call?e(t.p):e;return m(r.unshift?r.raw?g(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,o(t.target),t.g,t.o,t.k)}x.bind({g:1});let h,f,b,y=x.bind({k:1});function v(e,t){let r=this||{};return function(){let s=arguments;function a(i,o){let n=Object.assign({},i),l=n.className||a.className;r.p=Object.assign({theme:f&&f()},n),r.o=/ *go\d+/.test(l),n.className=x.apply(r,s)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),b&&d[0]&&b(n),h(d,n)}return t?t(a):a}}var w=e=>"function"==typeof e,N=(e,t)=>w(e)?e(t):e,k=(()=>{let e=0;return()=>(++e).toString()})(),I=(()=>{let e;return()=>e})(),S=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return S(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},D=[],_={toasts:[],pausedAt:void 0},q=e=>{_=S(_,e),D.forEach(e=>{e(_)})},A={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},P=(e={})=>{let[t,r]=j(_),s=Q(_);H(()=>(s.current!==_&&r(_),D.push(r),()=>{let e=D.indexOf(r);e>-1&&D.splice(e,1)}),[]);let a=t.toasts.map(t=>{var r,s,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||A[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...t,toasts:a}},C=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||k()}),O=e=>(t,r)=>{let s=C(t,e,r);return q({type:2,toast:s}),s.id},L=(e,t)=>O("blank")(e,t);L.error=O("error"),L.success=O("success"),L.loading=O("loading"),L.custom=O("custom"),L.dismiss=e=>{q({type:3,toastId:e})},L.remove=e=>q({type:4,toastId:e}),L.promise=(e,t,r)=>{let s=L.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?N(t.success,e):void 0;return a?L.success(a,{id:s,...r,...null==r?void 0:r.success}):L.dismiss(s),e}).catch(e=>{let a=t.error?N(t.error,e):void 0;a?L.error(a,{id:s,...r,...null==r?void 0:r.error}):L.dismiss(s)}),e};var E=(e,t)=>{q({type:1,toast:{id:e,height:t}})},R=()=>{q({type:5,time:Date.now()})},$=new Map,z=1e3,U=(e,t=z)=>{if($.has(e))return;let r=setTimeout(()=>{$.delete(e),q({type:4,toastId:e})},t);$.set(e,r)},G=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,T=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${G} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`),B=(v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${M} 1s linear infinite;
`,y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),X=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,J=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${X} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,v("div")`
  position: absolute;
`,v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`);v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${J} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,s=a.createElement,c.p=void 0,h=s,f=void 0,b=void 0,x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var K=L},53230:(e,t,r)=>{Promise.resolve().then(r.bind(r,55038))},55038:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>m});var s=r(60687),a=r(43210),i=r(85814),o=r.n(i),n=r(16189),l=r(7828),d=r(80043),c=r(75535),u=r(37590),p=r(21295);function m(){let{setToken:e}=(0,p.A)(),t=(0,n.useRouter)(),[r,i]=(0,a.useState)({email:"",password:""}),[m,g]=(0,a.useState)(!1),[x,h]=(0,a.useState)(""),f=e=>{let{name:t,value:r}=e.target;i(e=>({...e,[t]:r})),h("")},b=async s=>{s.preventDefault(),g(!0),h("");try{let s=(await (0,l.x9)(d.j,r.email,r.password)).user;if(s){let r=(0,c.H9)(d.db,"users",s.uid),a=await (0,c.x7)(r),i={uid:s.uid,email:s.email,name:s.displayName||"User",isLoggedIn:!0};if(a.exists()){let t=a.data();i={...i,name:t.name||s.displayName||"User",...t};let r=await s.getIdToken();localStorage.setItem("token",r),e(r)}else await (0,c.BN)(r,{name:s.displayName||"User",email:s.email,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()});localStorage.setItem("user",JSON.stringify(i)),u.Ay.success("Login successful!"),t.push("/dashboard")}}catch(t){console.error("Login error:",t);let e="An error occurred during login";switch(t.code){case"auth/user-not-found":e="No account found with this email. Please register first.";break;case"auth/wrong-password":e="Incorrect password. Please try again.";break;case"auth/invalid-email":e="Invalid email address format.";break;case"auth/too-many-requests":e="Too many failed attempts. Please try again later.";break;case"auth/user-disabled":e="This account has been disabled.";break;case"auth/invalid-credential":e="Invalid credentials. Please check your email and password.";break;default:e=t.message||"Login failed. Please try again."}h(e),u.Ay.error(e)}finally{g(!1)}},y=async()=>{g(!0),h("");try{let e=new l.HF,r=(await (0,l.df)(d.j,e)).user;if(r){let e=(0,c.H9)(d.db,"users",r.uid);(await (0,c.x7)(e)).exists()?await (0,c.BN)(e,{lastLogin:new Date().toISOString()},{merge:!0}):await (0,c.BN)(e,{name:r.displayName||"User",email:r.email,photoURL:r.photoURL||"",provider:"google",createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()});let s={uid:r.uid,email:r.email,name:r.displayName||"User",photoURL:r.photoURL||"",isLoggedIn:!0};localStorage.setItem("user",JSON.stringify(s)),u.Ay.success("Google sign-in successful!"),t.push("/dashboard")}}catch(t){console.error("Google sign-in error:",t);let e=t.message||"Google sign-in failed";h(e),u.Ay.error(e)}finally{g(!1)}};return(0,s.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8",children:(0,s.jsxs)("div",{className:"max-w-md w-full space-y-8",children:[(0,s.jsxs)("div",{className:"text-center",children:[(0,s.jsxs)(o(),{href:"/",className:"flex items-center justify-center space-x-2 mb-6",children:[(0,s.jsx)("span",{className:"text-3xl",children:"\uD83D\uDEE1️"}),(0,s.jsx)("h1",{className:"text-3xl font-bold text-blue-600",children:"SecureLife"})]}),(0,s.jsx)("h2",{className:"text-2xl font-bold text-gray-900",children:"Sign in to your account"}),(0,s.jsx)("p",{className:"mt-2 text-gray-600",children:"Access your insurance dashboard"})]}),(0,s.jsxs)("div",{className:"bg-white rounded-xl shadow-lg p-8",children:[(0,s.jsxs)("form",{onSubmit:b,className:"space-y-6",children:[x&&(0,s.jsx)("div",{className:"bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg",children:x}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Email Address"}),(0,s.jsx)("input",{type:"email",name:"email",value:r.email,onChange:f,required:!0,className:"w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Enter your email"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Password"}),(0,s.jsx)("input",{type:"password",name:"password",value:r.password,onChange:f,required:!0,className:"w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Enter your password"})]}),(0,s.jsxs)("div",{className:"flex items-center justify-between",children:[(0,s.jsxs)("div",{className:"flex items-center",children:[(0,s.jsx)("input",{type:"checkbox",className:"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"}),(0,s.jsx)("label",{className:"ml-2 block text-sm text-gray-700",children:"Remember me"})]}),(0,s.jsx)(o(),{href:"/forgot-password",className:"text-sm text-blue-600 hover:text-blue-700",children:"Forgot password?"})]}),(0,s.jsx)("button",{type:"submit",disabled:m,className:"w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:m?"Signing in...":"Sign In"})]}),(0,s.jsxs)("div",{className:"mt-6",children:[(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)("div",{className:"absolute inset-0 flex items-center",children:(0,s.jsx)("div",{className:"w-full border-t border-gray-300"})}),(0,s.jsx)("div",{className:"relative flex justify-center text-sm",children:(0,s.jsx)("span",{className:"px-2 bg-white text-gray-500",children:"Or continue with"})})]}),(0,s.jsxs)("div",{className:"mt-6 grid grid-cols-2 gap-3",children:[(0,s.jsxs)("button",{onClick:y,disabled:m,className:"w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,s.jsx)("span",{className:"mr-2",children:"\uD83D\uDCF1"}),"Google"]}),(0,s.jsxs)("button",{disabled:!0,className:"w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",children:[(0,s.jsx)("span",{className:"mr-2",children:"\uD83D\uDCDE"}),"OTP (Coming Soon)"]})]})]}),(0,s.jsx)("div",{className:"mt-6 text-center",children:(0,s.jsxs)("p",{className:"text-sm text-gray-600",children:["Don't have an account?"," ",(0,s.jsx)(o(),{href:"/register",className:"text-blue-600 hover:text-blue-700 font-medium",children:"Sign up here"})]})})]})]})})}},55511:e=>{"use strict";e.exports=require("crypto")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73496:e=>{"use strict";e.exports=require("http2")},74075:e=>{"use strict";e.exports=require("zlib")},79551:e=>{"use strict";e.exports=require("url")},80043:(e,t,r)=>{"use strict";r.d(t,{db:()=>n,j:()=>l});var s=r(67989),a=r(75535),i=r(7828);let o=(0,s.Wp)({apiKey:"AIzaSyC7HdmXgysmn7AfhiICnu3PVAj-f17vPjs",authDomain:"itax-7c8ea.firebaseapp.com",projectId:"itax-7c8ea",storageBucket:"itax-7c8ea.firebasestorage.app",messagingSenderId:"532409625604",appId:"1:532409625604:web:545814898b227685209951",measurementId:"G-FR8DCX5P10"}),n=(0,a.aU)(o),l=(0,i.xI)(o)},81630:e=>{"use strict";e.exports=require("http")},81804:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/home/akshatgg/projects/Itax_insurance_app/app/auth/login/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/akshatgg/projects/Itax_insurance_app/app/auth/login/page.tsx","default")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[719,239,594,321],()=>r(2952));module.exports=s})();