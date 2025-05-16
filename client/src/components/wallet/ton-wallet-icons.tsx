import React from 'react';

export const TonkeeperIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#0098EA"/>
    <path d="M27.3625 15.2187C27.3625 15.2187 27.5563 14.8 28.2 14.8C28.8438 14.8 29.05 15.2312 29.05 15.2312L24.075 25.5625H15.9125L10.95 15.2312C10.95 15.2312 11.1563 14.8 11.8 14.8C12.4438 14.8 12.6375 15.2187 12.6375 15.2187L16.8625 24.0625H23.1375L27.3625 15.2187Z" fill="white"/>
  </svg>
);

export const TonhubIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#45AEF5"/>
    <path d="M29 14.6L20 10L11 14.6V25.4L20 30L29 25.4V14.6ZM19.8 13.2L24.6 15.7L19.8 18.2L15 15.7L19.8 13.2ZM25.8 23.5L20 26.6L14.2 23.5V17.3L19.8 20.3L25.8 17.1V23.5Z" fill="white"/>
  </svg>
);

export const OpenMaskIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#7643F0"/>
    <path d="M14 14H17.5L20 20L22.5 14H26L22 23L26 30H22.5L20 24L17.5 30H14L18 23L14 14Z" fill="white"/>
  </svg>
);

export const MyTonWalletIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#0088CC"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 12.5C11.1716 12.5 10.5 13.1716 10.5 14V26C10.5 26.8284 11.1716 27.5 12 27.5H28C28.8284 27.5 29.5 26.8284 29.5 26V14C29.5 13.1716 28.8284 12.5 28 12.5H12ZM15 16.5C14.7239 16.5 14.5 16.7239 14.5 17V23C14.5 23.2761 14.7239 23.5 15 23.5H17C17.2761 23.5 17.5 23.2761 17.5 23V17C17.5 16.7239 17.2761 16.5 17 16.5H15ZM19.5 17C19.5 16.7239 19.7239 16.5 20 16.5H22C22.2761 16.5 22.5 16.7239 22.5 17V23C22.5 23.2761 22.2761 23.5 22 23.5H20C19.7239 23.5 19.5 23.2761 19.5 23V17ZM25 16.5C24.7239 16.5 24.5 16.7239 24.5 17V23C24.5 23.2761 24.7239 23.5 25 23.5H27C27.2761 23.5 27.5 23.2761 27.5 23V17C27.5 16.7239 27.2761 16.5 27 16.5H25Z" fill="white"/>
  </svg>
);

const TonWalletIcons = {
  TonkeeperIcon,
  TonhubIcon,
  OpenMaskIcon,
  MyTonWalletIcon
};

export default TonWalletIcons;