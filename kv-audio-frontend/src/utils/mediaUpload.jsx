import { createClient } from "@supabase/supabase-js"  // @supabase/supabase-js indha libarary aal createClient endra functionei import seidhal

const anon_key = "sb_publishable_YVS8QAiPk-iDM1QHIa9qFQ_yslPD0ka" //supabaseaal kideiththa anon key
const supabase_url = "https://wzqkwvblzpxdxfmjstie.supabase.co" //supabaseaal kideiththa url

const supabase = createClient(supabase_url, anon_key )  //supa base udanaana connection

export default function mediaUpload(file){

    return new Promise( (resolve, reject)=>{

    if ( file == null){
        reject("No file selected") //endha file/image upload seiiyaawidil 
    }

    const timesStamp = new Date().getTime(); //get the current time
    const fileName = timesStamp+file.name; //in supabase we cant save files with the same name so we add currentTime infront of the file name so each file has a unique name(tricky)

    supabase.storage.from("images").upload(fileName, file, { //images : bucket name that we gave in supabase ; "file" : parameter name from the funtion mediaUpload;"
        cacheControl : '3600',
        upsert: false
    }).then( (res)=>{

        const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl; //images : bucket name ; file.name: related file/image name;   upload ahina image in Url ei eduththal to "publicUrl"
        resolve(publicUrl)
    }).catch( ()=>{
        reject("Error uploading file")
    })
    })


}