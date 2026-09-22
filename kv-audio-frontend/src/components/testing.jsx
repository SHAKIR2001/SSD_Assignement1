import { useState } from "react"
import mediaUpload from "../utils/mediaUpload";

export default function Testing() {
  const [file, setFile] = useState(null);

  function uploadFile(){
    mediaUpload(file).then( (url)=>{  //indha function moolam upload seidha image in URL varum 
        console.log(url)
    })
  }


  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-4">
      <input
        type="file"
        multiple //can upload multiple images
        className="
          cursor-pointer
          text-sm
          file:mr-3
          file:rounded
          file:border file:border-gray-400
          file:bg-white
          file:px-3 file:py-1.5
          file:text-sm
          file:cursor-pointer
          hover:file:bg-gray-50
        "
        
        onChange={ (e)=>{setFile(e.target.files[0])}} 
      />

      <button
        className="
          bg-blue-500 w-[80px] h-[40px]
          rounded
          border border-blue-700
          cursor-pointer
          hover:bg-blue-600
        "
        onClick={uploadFile}
        type="button"
      >
        Upload
      </button>

    </div>
  )
}