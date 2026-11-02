import { NavLink } from 'react-router';

import logo from '../../assets/images/logo.png';
import { cn } from '../../utils/cn';
import { useState } from 'react';

export default function Footer({ className="" }) {
  const [genreMenuOpen, setGenreMenuOpen] = useState(false);
  const [supportMenuOpen, setSupportMenuOpen] = useState(true);

  let genreGridRows = genreMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
  let supportGridRows = supportMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';

  return (
    <footer className={cn('mt-20 max-sm:mt-7 border border-t-outline-border py-15 px-20 max-sm:p-5 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-start', className)}>
      <div className="flex flex-col gap-6.5 max-sm:gap-4">
        <img
          src={logo} alt="Chill Logo"
          className='w-[163px] max-sm:w-22'
        />
        <p className='text-base max-sm:text-caption-1-regular text-text-light-secondary'>&copy;2023 Chill All Rights Reserved.</p>
      </div>

      <div className='flex flex-col max-sm:mt-10 max-sm:w-full'>
        <div
          onClick={() => setGenreMenuOpen(prev => !prev)}
          className='flex justify-between items-center'
        >
          <h6 className="text-body-medium-bold max-sm:text-body-medium-medium text-white">Genre</h6>
          <i className={`ri-arrow-right-s-line hidden max-sm:block text-white text-2xl cursor-pointer ${genreMenuOpen ? 'rotate-90' : ''} transition-all ease-out transition-300`}></i>
        </div>

        <div className={`max-sm:grid ${genreGridRows} transition-all ease-out transition-300`}>
          <div className='overflow-hidden min-h-0'>
            <div className='flex gap-7 max-sm:gap-x-12 max-sm:gap-y-5 flex-wrap'>
              <div className='flex flex-col gap-2 mt-[15px]'>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Aksi</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Anak-anak</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Anime</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Britania</NavLink>
              </div>
              <div className='flex flex-col gap-2'>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Drama</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Fantasi Ilmiah &amp; Fantasi</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Kejahatan</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >KDrama</NavLink>
              </div>
              <div className='flex flex-col gap-2'>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Komedi</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Petualangan</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Perang</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Romantis</NavLink>
              </div>
              <div className='flex flex-col gap-2'>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Sains &amp; Alam</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Thriller</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col max-sm:mt-2 max-sm:w-full'>
        <div
          onClick={() => setSupportMenuOpen(prev => !prev)}
          className='flex justify-between items-center'
        >
          <h6 className="text-body-medium-bold max-sm:text-body-medium-medium text-white">Bantuan</h6>
          <i className={`ri-arrow-right-s-line hidden max-sm:block text-white text-2xl cursor-pointer ${supportMenuOpen ? 'rotate-90' : ''} transition-all ease-out transition-300`}></i>
        </div>

        <div className={`max-sm:grid ${supportGridRows} transition-all ease-out transition-300`}>
          <div className='overflow-hidden min-h-0'>
            <div className='flex gap-7 max-sm:gap-x-12 max-sm:gap-y-5 flex-wrap'>
              <div className='flex flex-col gap-2 mt-[15px]'>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >FAQ</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Kontak Kami</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Privasi</NavLink>
                <NavLink
                  to="#"
                  className='text-body-medium-medium text-text-light-secondary'
                >Syarat &amp; Ketentuan</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}