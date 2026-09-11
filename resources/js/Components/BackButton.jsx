import BackPhoto from '@/../images/arrow-back-ios-rounded.png';

export default function BackButton({ back }){
    return(
        <div>
            <button onClick={() => {  back();  }} className='flex items-center fustify-start hover:cursor-pointer'>
                <img src={BackPhoto} alt="backbutton" className='w-[15px] h-[15px]' />
                <span className='text-[#73768C] text-[15px]'>Wróć</span>
            </button>
        </div>
    );
}