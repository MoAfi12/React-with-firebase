import { useEffect, useState } from 'react'
import './App.css'
import { Auth } from './components/auth'
import {getDocs , collection , addDoc, doc, deleteDoc, updateDoc} from "firebase/firestore"
import { db , storage} from './config/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

function App() {
 const [moviesList , setMoviesList] = useState([])
 const [movieName , setMovieName] = useState('')
 const [movieRating , setMovieRating] = useState(0)
 const [movieOscar , setMoviesOscar] = useState(false)

 const[fileUpload , setFileUpload] = useState(null)
 const [movieImageURLs, setMovieImageURLs] = useState({});


 const[updatedMovieName , setUpdatedMovieName] = useState('')

 const moviesReference = collection(db , "movies")

 const getList = async()=>{
  try{
   const data = await getDocs(moviesReference)
   const list = data.docs.map((doc) => (
    {
      id: doc.id,
      ...doc.data(),
  
    }
  
  ))
   setMoviesList(list)
  }catch(e){
    console.log(e)
  };
 }

 useEffect(()=>{
getList()
 } , [])

const onSubmit = async ()=>{
try {
  await addDoc(moviesReference , {
    name: movieName , 
    rating: movieRating,
    isoscar: movieOscar
  })

  getList()
} catch (error) {
  console.log(error)
}
}

const deletedMovie = async (id)=>{
const movieDoc = doc(db , "movies" , id)
await deleteDoc(movieDoc)
getList()
}

const updatedMovie = async (id)=>{
const movieDoc = doc(db , "movies" , id)
await updateDoc(movieDoc , {name: updatedMovieName})
getList()
}


const uploadFile = async ()=>{

  try {
    if(!fileUpload){
      return;
    }
    const fileFolderRef = ref(storage , `fileResource/${fileUpload.name}`)
    await uploadBytes(fileFolderRef, fileUpload)

    const downloadURL = await getDownloadURL(fileFolderRef);
    setMovieImageURLs((prevURLs) => ({
      ...prevURLs,
      [doc.id]: downloadURL,
    }));

  // Set the movie list
  const moviesData = await Promise.all(list);
  setMoviesList(moviesData);
    console.log('File uploaded, download URL:', downloadURL);
    getList()
  } catch (error) {
  console.error("error uploading file", error)
  }

}

  return (
    <>
   <Auth />

<input type="text" placeholder='movie name' value={movieName} onChange={(e)=> setMovieName(e.target.value)} />
<input type="number" placeholder='rating /10' value={movieRating} onChange={(e)=> setMovieRating(Number(e.target.value))} />
<input type="checkbox" checked={movieOscar} onChange={(e) => setMoviesOscar(e.target.checked)} />
<label htmlFor="">oscar movie</label>

<button className='bg-slate-200' onClick={onSubmit}>submit movie</button>


<div className="">
{moviesList.map((movie)=>(
<div key={movie.id}>

<h1 className={`${movie.isoscar ? 'text-green-500' : 'text-red-600'}`} >name:{movie.name}</h1>
<p>rating: {movie.rating}</p>
<p className='text-blue-700'>date: {movie.date}</p>
<button className='bg-gray-500' onClick={()=>deletedMovie(movie.id)}>delete</button>

{movieImageURLs[movie.id] && <img src={movieImageURLs[movie.id]} alt={`Image for ${movie.name}`} />}

<input className='border border-gray-700' type="text" placeholder='updated movie' onChange={(e)=> setUpdatedMovieName(e.target.value)}/>
<button className='bg-pink-500' onClick={()=> {updatedMovie(movie.id)}}>update movie</button>

<input type="file" onChange={(e)=> setFileUpload(e.target.files[0])} />
<button onClick={uploadFile}>upload image</button>

</div>

))}

</div>


    </>
  )
}

export default App
