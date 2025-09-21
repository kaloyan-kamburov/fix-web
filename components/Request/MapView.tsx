export const MapView = () => {
  return (
    <div className="relative">
      {/* <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/11dff5de80b2c36ced7cc905d651b28eef2d56bd?width=1280"
        alt="Map showing location"
        className="relative self-stretch rounded-lg h-[147px] max-sm:h-[120px] w-full object-cover"
      /> */}
      <div className="absolute" style={{ left: "181px", bottom: "322px" }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="map-pin"
          style={{ width: "24px", height: "24px" }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 10.2C18 6.57 15.35 4 12 4C8.65 4 6 6.57 6 10.2C6 12.54 7.95 15.64 12 19.34C16.05 15.64 18 12.54 18 10.2ZM10 10C10 11.1 10.9 12 12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10Z"
            fill="#C59A02"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 4C15.35 4 18 6.57 18 10.2C18 12.54 16.05 15.64 12 19.34C7.95 15.64 6 12.54 6 10.2C6 6.57 8.65 4 12 4ZM20 10.2C20 5.22 16.2 2 12 2C7.8 2 4 5.22 4 10.2C4 13.52 6.67 17.45 12 22C17.33 17.45 20 13.52 20 10.2Z"
            fill="#C59A02"
          />
        </svg>
      </div>
    </div>
  );
};
