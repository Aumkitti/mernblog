import {useState, useContext, useEffect} from 'react'
import { UserContext } from '../context/UserContext';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
const baseURL = import.meta.env.VITE_BASE_URL;

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();
  useEffect(()=>{
    fetch(`${baseURL}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo)
      })
    })
  }, [id]);
  if (!postInfo) return "";

  const handleDelete = () => {
    fetch(`${baseURL}/post/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userInfo.token}`, 
      },
    })
      .then((response) => {
        if (response.ok) {
         
          history.push('/');
        } else {
        
          console.error('Error deleting post');
        }
      })
      .catch((error) => {
        console.error('Error deleting post', error);
      });
  };

  return (
    <div className='post-page'>
        <h1>
        {postInfo.title}
        </h1>
        <time>{format(new Date(postInfo.createdAt), "dd MMMM yyyy HH:MM")}</time>
        <div className='author'>By @{postInfo.author.username}</div>
        {userInfo?.id === postInfo.author._id &&(
          <div className='edit-row' >
            <Link className='edit-btn' to={`/edit/${postInfo._id}`}>
            <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"></path>
            </svg>
            Edit Post
            </Link>
          </div>
          
        )}
        {userInfo?.id === postInfo.author._id &&(
        <div className='delete-row'>
            <button className='delete-btn' onClick={handleDelete}>
            <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
            </svg>
            Delete Post
            </button>
          </div>
        )}
        <div className='image'>
        <img src={`${baseURL}/${postInfo.cover}`} alt="" />
        </div>
        <div className='content' dangerouslySetInnerHTML={{__html: postInfo.content}}>
        
        </div>
    </div>
  )
}

export default PostPage
