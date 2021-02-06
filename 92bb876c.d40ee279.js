(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{77:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return b}));var r=n(3),o=n(7),a=(n(0),n(88)),i={id:"getting_started",title:"Getting Started",sidebar_label:"Getting Started",slug:"/"},c={unversionedId:"getting_started",id:"getting_started",isDocsHomePage:!1,title:"Getting Started",description:"To start a new task follow these steps:",source:"@site/docs/getting_started.md",slug:"/",permalink:"/honeycomb/docs/",editUrl:"https://github.com/brown-ccv/honeycomb/edit/documentation/docs/getting_started.md",version:"current",sidebar_label:"Getting Started",sidebar:"someSidebar",previous:{title:"Software Prerequisites",permalink:"/honeycomb/docs/software_prerecs"},next:{title:"Use installers via GitHub Actions",permalink:"/honeycomb/docs/"}},l=[{value:"1. Start your new task from our template repository",id:"1-start-your-new-task-from-our-template-repository",children:[]},{value:"2. Change name and description",id:"2-change-name-and-description",children:[]},{value:"3. Install the dependencies.",id:"3-install-the-dependencies",children:[]},{value:"4. Run the task in dev mode",id:"4-run-the-task-in-dev-mode",children:[]},{value:"5. Check out the data",id:"5-check-out-the-data",children:[]},{value:"6. Quit The Task",id:"6-quit-the-task",children:[]},{value:"7. Merge updates from honeycomb template repo",id:"7-merge-updates-from-honeycomb-template-repo",children:[]}],p={toc:l};function b(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"To start a new task follow these steps:"),Object(a.b)("h3",{id:"1-start-your-new-task-from-our-template-repository"},"1. Start your new task from our template repository"),Object(a.b)("p",null,"The simplest way to get started is creating a new repository using Honeycomb as a template."),Object(a.b)("p",null,"Go to ",Object(a.b)("a",{parentName:"p",href:"https://github.com/brown-ccv/honeycomb"},"https://github.com/brown-ccv/honeycomb")," and click on ",Object(a.b)("inlineCode",{parentName:"p"},"Use this template")," on the top right. Then select the organization and the name of your repository and click on ",Object(a.b)("inlineCode",{parentName:"p"},"create repository from template")),Object(a.b)("p",null,"Alternatively, you can use GitHub CLI to create a new project based on the Honeycomb template repository. First, install GitHub CLI (",Object(a.b)("a",{parentName:"p",href:"https://cli.github.com/"},"https://cli.github.com/"),"), then simply run on your terminal: "),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"gh repo create your-new-task-name --template brown-ccv/honeycomb\n")),Object(a.b)("p",null,"You can now move into the directory that was just created"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"cd your-new-task-name\n")),Object(a.b)("h3",{id:"2-change-name-and-description"},"2. Change name and description"),Object(a.b)("p",null,"Update the ",Object(a.b)("inlineCode",{parentName:"p"},"package.json")," fields to reflect your app name and description, e.g. ",Object(a.b)("inlineCode",{parentName:"p"},"name"),", ",Object(a.b)("inlineCode",{parentName:"p"},"author"),", ",Object(a.b)("inlineCode",{parentName:"p"},"repository")),Object(a.b)("h3",{id:"3-install-the-dependencies"},"3. Install the dependencies."),Object(a.b)("p",null,"You may first need to install Node.js (",Object(a.b)("a",{parentName:"p",href:"https://nodejs.org/en/download/"},"https://nodejs.org/en/download/"),") before being able to use npm commands in the terminal. Then you will be able to install the dependencies for HoneyComb using"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"npm install\n")),Object(a.b)("h3",{id:"4-run-the-task-in-dev-mode"},"4. Run the task in dev mode"),Object(a.b)("p",null,"To launch an electron window with the task with the inspector open to the console and will hot-reload when changes are made to the app"),Object(a.b)("p",null,"**For Mac and Linux:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"npm run dev\n")),Object(a.b)("p",null,"**For Windows:\nYou will need to open 2 terminals. In the first -and make sure you are in the ",Object(a.b)("inlineCode",{parentName:"p"},"task-<TASK NAME>")," repo directory- run the command:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"npm start\n")),Object(a.b)("p",null,"In the second terminal -  make sure you are in the ",Object(a.b)("inlineCode",{parentName:"p"},"task-<TASK NAME>")," repo directory-, run:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"npm run electron-dev\n")),Object(a.b)("h3",{id:"5-check-out-the-data"},"5. Check out the data"),Object(a.b)("p",null,"The data is saved throughout the task to the users's app directory.  This is logged at the beginning of the task wherever you ran ",Object(a.b)("inlineCode",{parentName:"p"},"npm run dev")," (for windows, instead in two different terminals ran ",Object(a.b)("inlineCode",{parentName:"p"},"npm start")," and ",Object(a.b)("inlineCode",{parentName:"p"},"npm run electron-dev"),"). It is also stored in a folder that is generated by the app, which should be found on the desktop."),Object(a.b)("h3",{id:"6-quit-the-task"},"6. Quit The Task"),Object(a.b)("p",null,"If you want to quit in the middle of the task, you can use these keyboard shortcuts:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"Ctrl+W (for PC/Windows)\n")),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"Cmd+Q (for Mac)\n")),Object(a.b)("p",null,"Partial data will be saved."),Object(a.b)("h3",{id:"7-merge-updates-from-honeycomb-template-repo"},"7. Merge updates from honeycomb template repo"),Object(a.b)("p",null,"Honeycomb is an active project, and will be updated with new features over time. To merge the honeycomb template repository updates with your task, follow the following steps:\nFirst time only:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"git remote add honeycomb https://github.com/brown-ccv/honeycomb.git\n")),Object(a.b)("p",null,"Every time: "),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"git fetch --all\n")),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"git merge honeycomb/main --allow-unrelated histories\n")),Object(a.b)("p",null,"If there are any conflicts:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},"git stash\n")),Object(a.b)("p",null,"To merge:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre"},'git commit -a -m "merge honeycomb latest"\n')))}b.isMDXComponent=!0},88:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return m}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),b=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=b(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},u=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=b(n),u=r,m=s["".concat(i,".").concat(u)]||s[u]||d[u]||a;return n?o.a.createElement(m,c(c({ref:t},p),{},{components:n})):o.a.createElement(m,c({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=u;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var p=2;p<a;p++)i[p]=n[p];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);