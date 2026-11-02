import { NavLink } from 'react-router';

import logo from '../../assets/images/logo.png';
import logoSmall from '../../assets/images/logo-small.png';
import avatar from '../../assets/images/avatar.webp';

export default function Navbar() {
  return (
    <nav className="bg-page-header-background py-[25px] px-20 max-sm:py-5 max-sm:px-5 flex justify-between items-center">
      <ul className="flex items-center gap-20 max-sm:gap-3 bg-red">
        <li className='leading-0'>
          <NavLink to="/" end>
            <img src={logo} alt="Logo" className='w-[103.55px] max-sm:hidden' />
            <img src={logoSmall} alt="Logo" className='w-5 hidden max-sm:block' />
          </NavLink>
        </li>
        <li>
          <a href="#" className='text-body-large-medium max-sm:text-caption-2-medium text-white'>Series</a>
        </li>
        <li>
          <a href="#" className='text-body-large-medium max-sm:text-caption-2-medium text-white'>Film</a>
        </li>
        <li>
          <NavLink to="/mylist" end>
            <span className='text-body-large-medium max-sm:text-caption-2-medium text-white'>Daftar Saya</span>
          </NavLink>
        </li>
      </ul>

      <div className='flex items-center gap-2 max-sm:gap-1 relative group cursor-pointer'>
        <img src={avatar} alt="Avatar" className='w-10 max-sm:w-5 aspect-square rounded-full' />
        <i className="ri-arrow-down-s-line text-white text-[28px] max-sm:text-base"></i>

        <ul className='bg-page-header-background py-1 absolute top-full right-0 translate-y-3 rounded-b-sm group-hover:translate-y-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all ease-out transition-300'>
          <li>
            <a href="#" className='flex items-center gap-[5px] py-2 px-3 text-body-small-medium max-sm:text-caption-2-medium text-white hover:text-primary transition-all ease-out transition-200 text-nowrap'>
              <i className="ri-user-fill text-base"></i>
              Profil Saya
            </a>
          </li>
          <li>
            <a href="#" className='flex items-center gap-[5px] py-2 px-3 text-body-small-medium max-sm:text-caption-2-medium text-white hover:text-primary transition-all ease-out transition-200 text-nowrap'>
              <i className="ri-star-fill text-base"></i>
              Ubah Premium
            </a>
          </li>
          <li>
            <a href="#" className='flex items-center gap-[5px] py-2 px-3 text-body-small-medium max-sm:text-caption-2-medium text-white hover:text-primary transition-all ease-out transition-200 text-nowrap'>
              <i className="ri-logout-box-r-line text-base"></i>
              Profil Keluar
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}