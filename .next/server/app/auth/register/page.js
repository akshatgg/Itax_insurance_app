(()=>{var e={};e.id=983,e.ids=[983],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},8490:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>u});var s=t(60687),a=t(37590),o=t(43210),i=t(85814),n=t.n(i),l=t(16189),d=t(7828),c=t(75535),m=t(80043);function u(){let e=(0,l.useRouter)(),[r,t]=(0,o.useState)({firstName:"",lastName:"",email:"",phone:"",password:"",confirmPassword:"",agreeToTerms:!1}),[i,u]=(0,o.useState)(!1),[p,h]=(0,o.useState)({}),[x,f]=(0,o.useState)(null),[g,b]=(0,o.useState)(!1),y=e=>{let{name:r,value:s,type:a,checked:o}=e.target;t(e=>({...e,[r]:"checkbox"===a?o:s})),p[r]&&h(e=>({...e,[r]:""})),x&&f(null)},v=()=>{let e={};if(r.firstName.trim()?r.firstName.trim().length<2&&(e.firstName="First name must be at least 2 characters"):e.firstName="First name is required",r.lastName.trim()?r.lastName.trim().length<2&&(e.lastName="Last name must be at least 2 characters"):e.lastName="Last name is required",r.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim())||(e.email="Please enter a valid email address"):e.email="Email is required",r.phone.trim()?/^\+?[\d\s\-\(\)]{10,}$/.test(r.phone.trim())||(e.phone="Please enter a valid phone number"):e.phone="Phone number is required",r.password){let t=r.password;t.length<8?e.password="Password must be at least 8 characters long":/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(t)||(e.password="Password must contain at least one uppercase letter, one lowercase letter, and one number")}else e.password="Password is required";return r.confirmPassword?r.password!==r.confirmPassword&&(e.confirmPassword="Passwords do not match"):e.confirmPassword="Please confirm your password",r.agreeToTerms||(e.agreeToTerms="You must agree to the terms and conditions"),h(e),0===Object.keys(e).length},w=e=>{switch(e){case"auth/email-already-in-use":return"An account with this email address already exists.";case"auth/weak-password":return"Password is too weak. Please choose a stronger password.";case"auth/invalid-email":return"Please enter a valid email address.";case"auth/operation-not-allowed":return"Email/password accounts are not enabled. Please contact support.";case"auth/network-request-failed":return"Network error. Please check your connection and try again.";case"auth/too-many-requests":return"Too many failed attempts. Please try again later.";default:return"An unexpected error occurred. Please try again."}},N=async t=>{if(t.preventDefault(),f(null),b(!1),v())try{u(!0);let t=(await (0,d.eJ)(m.j,r.email.trim(),r.password)).user;if(!t)throw Error("Failed to create user account");await (0,d.r7)(t,{displayName:`${r.firstName.trim()} ${r.lastName.trim()}`});try{await (0,d.gA)(t),a.oR.success("Verification email sent! Please check your inbox."),b(!0)}catch(e){console.warn("Failed to send verification email:",e)}let s={firstName:r.firstName.trim(),lastName:r.lastName.trim(),email:r.email.trim().toLowerCase(),phone:r.phone.trim(),displayName:`${r.firstName.trim()} ${r.lastName.trim()}`,emailVerified:!1,createdAt:(0,c.O5)(),updatedAt:(0,c.O5)(),role:"user",isActive:!0};await (0,c.BN)((0,c.H9)(m.db,"users",t.uid),s),g?setTimeout(()=>{e.push("/auth/login")},2e3):e.push("/auth/login")}catch(r){console.error("Registration error:",r);let e=r.code;"auth/email-already-in-use"===e?h(e=>({...e,email:"An account with this email address already exists."})):"auth/weak-password"===e?h(e=>({...e,password:"Password is too weak. Please choose a stronger password."})):f(w(e))}finally{u(!1)}};return(0,s.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8",children:(0,s.jsxs)("div",{className:"max-w-md w-full space-y-8",children:[(0,s.jsxs)("div",{className:"text-center",children:[(0,s.jsxs)(n(),{href:"/",className:"flex items-center justify-center space-x-2 mb-6",children:[(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"text-blue-600",children:(0,s.jsx)("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})}),(0,s.jsx)("h1",{className:"text-3xl font-bold text-blue-600",children:"SecureLife"})]}),(0,s.jsx)("h2",{className:"text-2xl font-bold text-gray-900",children:"Create your account"}),(0,s.jsx)("p",{className:"mt-2 text-gray-600",children:"Join thousands of satisfied customers"})]}),(0,s.jsxs)("div",{className:"bg-white rounded-xl shadow-lg p-8",children:[g&&(0,s.jsx)("div",{className:"mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md",children:(0,s.jsxs)("div",{className:"flex",children:[(0,s.jsx)("div",{className:"flex-shrink-0",children:(0,s.jsx)("svg",{className:"h-5 w-5 text-green-400",viewBox:"0 0 20 20",fill:"currentColor",children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})})}),(0,s.jsx)("div",{className:"ml-3",children:(0,s.jsx)("p",{className:"text-sm font-medium",children:"Account created successfully! A verification email has been sent to your email address."})})]})}),(0,s.jsxs)("form",{onSubmit:N,className:"space-y-6",children:[x&&(0,s.jsx)("div",{className:"p-3 bg-red-100 border border-red-400 text-red-700 rounded-md",children:(0,s.jsxs)("div",{className:"flex",children:[(0,s.jsx)("div",{className:"flex-shrink-0",children:(0,s.jsx)("svg",{className:"h-5 w-5 text-red-400",viewBox:"0 0 20 20",fill:"currentColor",children:(0,s.jsx)("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})})}),(0,s.jsx)("div",{className:"ml-3",children:(0,s.jsx)("p",{className:"text-sm font-medium",children:x})})]})}),(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"firstName",className:"block text-sm font-medium text-gray-700 mb-1",children:"First Name"}),(0,s.jsx)("input",{id:"firstName",type:"text",name:"firstName",value:r.firstName,onChange:y,className:`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${p.firstName?"border-red-500":"border-gray-300"}`,placeholder:"First name","aria-invalid":p.firstName?"true":"false","aria-describedby":p.firstName?"firstName-error":void 0}),p.firstName&&(0,s.jsx)("p",{id:"firstName-error",className:"mt-1 text-sm text-red-600",children:p.firstName})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"lastName",className:"block text-sm font-medium text-gray-700 mb-1",children:"Last Name"}),(0,s.jsx)("input",{id:"lastName",type:"text",name:"lastName",value:r.lastName,onChange:y,className:`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${p.lastName?"border-red-500":"border-gray-300"}`,placeholder:"Last name","aria-invalid":p.lastName?"true":"false","aria-describedby":p.lastName?"lastName-error":void 0}),p.lastName&&(0,s.jsx)("p",{id:"lastName-error",className:"mt-1 text-sm text-red-600",children:p.lastName})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700 mb-1",children:"Email Address"}),(0,s.jsx)("input",{id:"email",type:"email",name:"email",value:r.email,onChange:y,className:`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${p.email?"border-red-500":"border-gray-300"}`,placeholder:"Enter your email","aria-invalid":p.email?"true":"false","aria-describedby":p.email?"email-error":void 0}),p.email&&(0,s.jsx)("p",{id:"email-error",className:"mt-1 text-sm text-red-600",children:p.email})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"phone",className:"block text-sm font-medium text-gray-700 mb-1",children:"Phone Number"}),(0,s.jsx)("input",{id:"phone",type:"tel",name:"phone",value:r.phone,onChange:y,className:`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${p.phone?"border-red-500":"border-gray-300"}`,placeholder:"Enter your phone number","aria-invalid":p.phone?"true":"false","aria-describedby":p.phone?"phone-error":void 0}),p.phone&&(0,s.jsx)("p",{id:"phone-error",className:"mt-1 text-sm text-red-600",children:p.phone})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700 mb-1",children:"Password"}),(0,s.jsx)("input",{id:"password",type:"password",name:"password",value:r.password,onChange:y,className:`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${p.password?"border-red-500":"border-gray-300"}`,placeholder:"Create a password","aria-invalid":p.password?"true":"false","aria-describedby":p.password?"password-error":void 0}),p.password&&(0,s.jsx)("p",{id:"password-error",className:"mt-1 text-sm text-red-600",children:p.password}),(0,s.jsx)("p",{className:"mt-1 text-xs text-gray-500",children:"Password must be at least 8 characters with uppercase, lowercase, and number"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{htmlFor:"confirmPassword",className:"block text-sm font-medium text-gray-700 mb-1",children:"Confirm Password"}),(0,s.jsx)("input",{id:"confirmPassword",type:"password",name:"confirmPassword",value:r.confirmPassword,onChange:y,className:`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${p.confirmPassword?"border-red-500":"border-gray-300"}`,placeholder:"Confirm your password","aria-invalid":p.confirmPassword?"true":"false","aria-describedby":p.confirmPassword?"confirmPassword-error":void 0}),p.confirmPassword&&(0,s.jsx)("p",{id:"confirmPassword-error",className:"mt-1 text-sm text-red-600",children:p.confirmPassword})]}),(0,s.jsxs)("div",{className:"flex items-start",children:[(0,s.jsx)("div",{className:"flex items-center h-5",children:(0,s.jsx)("input",{id:"agreeToTerms",type:"checkbox",name:"agreeToTerms",checked:r.agreeToTerms,onChange:y,className:"h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded","aria-describedby":p.agreeToTerms?"terms-error":void 0})}),(0,s.jsxs)("div",{className:"ml-3 text-sm",children:[(0,s.jsxs)("label",{htmlFor:"agreeToTerms",className:"font-medium text-gray-700",children:["I agree to the"," ",(0,s.jsx)(n(),{href:"/terms",className:"text-blue-600 hover:text-blue-700",children:"Terms of Service"})," ","and"," ",(0,s.jsx)(n(),{href:"/privacy",className:"text-blue-600 hover:text-blue-700",children:"Privacy Policy"})]}),p.agreeToTerms&&(0,s.jsx)("p",{id:"terms-error",className:"mt-1 text-sm text-red-600",children:p.agreeToTerms})]})]}),(0,s.jsx)("button",{type:"submit",disabled:i,className:"w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:i?"Creating Account...":"Create Account"})]}),(0,s.jsx)("div",{className:"mt-6 text-center",children:(0,s.jsxs)("p",{className:"text-sm text-gray-600",children:["Already have an account?"," ",(0,s.jsx)(n(),{href:"/login",className:"text-blue-600 hover:text-blue-700 font-medium",children:"Sign in here"})]})})]}),(0,s.jsxs)("div",{className:"bg-green-50 rounded-lg p-4",children:[(0,s.jsx)("h3",{className:"text-sm font-semibold text-green-900 mb-2",children:"Why Join SecureLife?"}),(0,s.jsxs)("ul",{className:"text-sm text-green-800 space-y-1",children:[(0,s.jsx)("li",{children:"✓ Instant policy quotes"}),(0,s.jsx)("li",{children:"✓ 24/7 customer support"}),(0,s.jsx)("li",{children:"✓ Easy claim processing"}),(0,s.jsx)("li",{children:"✓ Competitive premiums"})]})]})]})})}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},16189:(e,r,t)=>{"use strict";var s=t(65773);t.o(s,"useRouter")&&t.d(r,{useRouter:function(){return s.useRouter}})},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},19771:e=>{"use strict";e.exports=require("process")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},37366:e=>{"use strict";e.exports=require("dns")},37590:(e,r,t)=>{"use strict";t.d(r,{Ay:()=>X,oR:()=>z});var s,a=t(43210);let o={data:""},i=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||o,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,c=(e,r)=>{let t="",s="",a="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?t=o+" "+i+";":s+="f"==o[1]?c(i,o):o+"{"+c(i,"k"==o[1]?"":r)+"}":"object"==typeof i?s+=c(i,r?r.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,r=>/&/.test(r)?r.replace(/&/g,e):e?e+" "+r:r)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=c.p?c.p(o,i):o+":"+i+";")}return t+(r&&a?r+"{"+a+"}":a)+s},m={},u=e=>{if("object"==typeof e){let r="";for(let t in e)r+=t+u(e[t]);return r}return e},p=(e,r,t,s,a)=>{let o=u(e),i=m[o]||(m[o]=(e=>{let r=0,t=11;for(;r<e.length;)t=101*t+e.charCodeAt(r++)>>>0;return"go"+t})(o));if(!m[i]){let r=o!==e?e:(e=>{let r,t,s=[{}];for(;r=n.exec(e.replace(l,""));)r[4]?s.shift():r[3]?(t=r[3].replace(d," ").trim(),s.unshift(s[0][t]=s[0][t]||{})):s[0][r[1]]=r[2].replace(d," ").trim();return s[0]})(e);m[i]=c(a?{["@keyframes "+i]:r}:r,t?"":"."+i)}let p=t&&m.g?m.g:null;return t&&(m.g=m[i]),((e,r,t,s)=>{s?r.data=r.data.replace(s,e):-1===r.data.indexOf(e)&&(r.data=t?e+r.data:r.data+e)})(m[i],r,s,p),i},h=(e,r,t)=>e.reduce((e,s,a)=>{let o=r[a];if(o&&o.call){let e=o(t),r=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=r?"."+r:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+s+(null==o?"":o)},"");function x(e){let r=this||{},t=e.call?e(r.p):e;return p(t.unshift?t.raw?h(t,[].slice.call(arguments,1),r.p):t.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):t,i(r.target),r.g,r.o,r.k)}x.bind({g:1});let f,g,b,y=x.bind({k:1});function v(e,r){let t=this||{};return function(){let s=arguments;function a(o,i){let n=Object.assign({},o),l=n.className||a.className;t.p=Object.assign({theme:g&&g()},n),t.o=/ *go\d+/.test(l),n.className=x.apply(t,s)+(l?" "+l:""),r&&(n.ref=i);let d=e;return e[0]&&(d=n.as||e,delete n.as),b&&d[0]&&b(n),f(d,n)}return r?r(a):a}}var w=e=>"function"==typeof e,N=(e,r)=>w(e)?e(r):e,P=(()=>{let e=0;return()=>(++e).toString()})(),k=(()=>{let e;return()=>e})(),q=(e,r)=>{switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===r.toast.id?{...e,...r.toast}:e)};case 2:let{toast:t}=r;return q(e,{type:+!!e.toasts.find(e=>e.id===t.id),toast:t});case 3:let{toastId:s}=r;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===r.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let a=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},C=[],A={toasts:[],pausedAt:void 0},_=e=>{A=q(A,e),C.forEach(e=>{e(A)})},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},$=(e={})=>{let[r,t]=j(A),s=Q(A);H(()=>(s.current!==A&&t(A),C.push(t),()=>{let e=C.indexOf(t);e>-1&&C.splice(e,1)}),[]);let a=r.toasts.map(r=>{var t,s,a;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||(null==(t=e[r.type])?void 0:t.removeDelay)||(null==e?void 0:e.removeDelay),duration:r.duration||(null==(s=e[r.type])?void 0:s.duration)||(null==e?void 0:e.duration)||T[r.type],style:{...e.style,...null==(a=e[r.type])?void 0:a.style,...r.style}}});return{...r,toasts:a}},I=(e,r="blank",t)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...t,id:(null==t?void 0:t.id)||P()}),F=e=>(r,t)=>{let s=I(r,e,t);return _({type:2,toast:s}),s.id},z=(e,r)=>F("blank")(e,r);z.error=F("error"),z.success=F("success"),z.loading=F("loading"),z.custom=F("custom"),z.dismiss=e=>{_({type:3,toastId:e})},z.remove=e=>_({type:4,toastId:e}),z.promise=(e,r,t)=>{let s=z.loading(r.loading,{...t,...null==t?void 0:t.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=r.success?N(r.success,e):void 0;return a?z.success(a,{id:s,...t,...null==t?void 0:t.success}):z.dismiss(s),e}).catch(e=>{let a=r.error?N(r.error,e):void 0;a?z.error(a,{id:s,...t,...null==t?void 0:t.error}):z.dismiss(s)}),e};var L=(e,r)=>{_({type:1,toast:{id:e,height:r}})},E=()=>{_({type:5,time:Date.now()})},R=new Map,S=1e3,D=(e,r=S)=>{if(R.has(e))return;let t=setTimeout(()=>{R.delete(e),_({type:4,toastId:e})},r);R.set(e,t)},O=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,M=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,B=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,G=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${M} 0.15s ease-out forwards;
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
    animation: ${B} 0.15s ease-out forwards;
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
`),V=(v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${G} 1s linear infinite;
`,y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),J=y`
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
}`,W=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${J} 0.2s ease-out forwards;
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
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,s=a.createElement,c.p=void 0,f=s,g=void 0,b=void 0,x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var X=z},41316:(e,r,t)=>{Promise.resolve().then(t.bind(t,66696))},55511:e=>{"use strict";e.exports=require("crypto")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66696:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>s});let s=(0,t(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/home/akshatgg/projects/Itax_insurance_app/app/auth/register/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/akshatgg/projects/Itax_insurance_app/app/auth/register/page.tsx","default")},73496:e=>{"use strict";e.exports=require("http2")},74075:e=>{"use strict";e.exports=require("zlib")},78116:(e,r,t)=>{Promise.resolve().then(t.bind(t,8490))},79551:e=>{"use strict";e.exports=require("url")},80043:(e,r,t)=>{"use strict";t.d(r,{db:()=>n,j:()=>l});var s=t(67989),a=t(75535),o=t(7828);let i=(0,s.Wp)({apiKey:"AIzaSyC7HdmXgysmn7AfhiICnu3PVAj-f17vPjs",authDomain:"itax-7c8ea.firebaseapp.com",projectId:"itax-7c8ea",storageBucket:"itax-7c8ea.firebasestorage.app",messagingSenderId:"532409625604",appId:"1:532409625604:web:545814898b227685209951",measurementId:"G-FR8DCX5P10"}),n=(0,a.aU)(i),l=(0,o.xI)(i)},81630:e=>{"use strict";e.exports=require("http")},83798:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>i.a,__next_app__:()=>m,pages:()=>c,routeModule:()=>u,tree:()=>d});var s=t(65239),a=t(48088),o=t(88170),i=t.n(o),n=t(30893),l={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);t.d(r,l);let d={children:["",{children:["auth",{children:["register",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,66696)),"/home/akshatgg/projects/Itax_insurance_app/app/auth/register/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,8179)),"/home/akshatgg/projects/Itax_insurance_app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,65284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,c=["/home/akshatgg/projects/Itax_insurance_app/app/auth/register/page.tsx"],m={require:t,loadChunk:()=>Promise.resolve()},u=new s.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/auth/register/page",pathname:"/auth/register",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[719,239,594,321],()=>t(83798));module.exports=s})();