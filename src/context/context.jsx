import { createContext, useState } from "react";
import run from "../config/gemini.js";


export const Context =createContext();
const ContextProvider =(props)=>{
    const [input,setInput]=useState("");
    const [recentPrompt,setRecentPrompt]=useState("");
    const [prevPrompts,setPrevPrompts]=useState([]);
    const [showResult,setShowResult]=useState(false);
    const [loading,setLoading]=useState(false);
    const [resultData,setResultData]=useState("");
    const delayPara=(index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        },75*index)
    }
    const newChat =()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent =async(prompt)=>{
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt!==undefined)
        {
            response=await run(prompt);
            setRecentPrompt(prompt)

        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response=await run(input)
        }
        
        
      let responseArray=response.split("**");
      let newresponse="" ;
      for(let i=0;i<responseArray.length;i++)
      {
        if(i===0 || i%2!==1){
            newresponse+=responseArray[i];
        }
        else{
            newresponse+="<b>"+responseArray[i]+"</b>";
        }
      }
      let newresponse2=newresponse.split("*").join("</br>")
      let newresponseArray=newresponse2.split(" ");
      for(let i=0;i<newresponseArray.length;i++)
      {
        const nextWord=newresponseArray[i];
        delayPara(i,nextWord+" ")
      }
      setLoading(false)
      setInput("")
    }
    


    const  contextValue={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
        
        
    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider