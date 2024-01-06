export const LineaLogoSquare: React.FC<JSX.IntrinsicElements['svg']> = (props) => {
  return (
    <svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19.9752 0.915039H0.0351562V20.8788H19.9752V0.915039Z" fill="#61DFFF" />
      <mask
        id="mask0_363_1389"
        style={{maskType: 'luminance'}}
        maskUnits="userSpaceOnUse"
        x="5"
        y="5"
        width="10"
        height="11"
      >
        <path d="M14.9594 5.91626H5.00537V15.914H14.9594V5.91626Z" fill="white" />
      </mask>
      <g mask="url(#mask0_363_1389)">
        <path
          d="M13.2723 15.914H5.00537V7.53857H6.89684V14.2908H13.2723V15.9132V15.914Z"
          fill="#121212"
        />
        <path
          d="M13.2722 9.16088C14.204 9.16088 14.9594 8.43456 14.9594 7.53858C14.9594 6.6426 14.204 5.91626 13.2722 5.91626C12.3403 5.91626 11.585 6.6426 11.585 7.53858C11.585 8.43456 12.3403 9.16088 13.2722 9.16088Z"
          fill="#121212"
        />
      </g>
    </svg>
  );
};
