import { useState } from "react"
export default function ImageSlider(props){
    const images =  props.images
    const[selectedImage,setSelectedImage] = useState(images[0]) //1st thadawei page load ahum podhu 1st image kaattum
    return(
        <div className="w-full h-full flex flex-col items-center ">
           <img src={selectedImage} alt="product" className="w-full h-[450px] 
           object-cover"/>
        <div className="w-full h-[150px] flex justify-center mt-[20px]">
                {
                    images.map( (image,index)=>{
                        return <img key={index} src={image} alt="Product" className={`w-[100px] mr-[2px] h-[100px] object-cover cursor-pointer ${image == selectedImage && "border border-accent "}`} onClick={ ()=>{  //selected image itku border 
                            setSelectedImage(image) //image ondrei click seiyyum podhu kurippita image peridhaaha theriyum (main image aaha)
                        }}/>
                    })
                }
        </div>



        </div>
    )
}