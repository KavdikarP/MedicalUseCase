const LoadingSplash = () => {
    return (
      <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
        <div className="w-96">
          <img className="loading" src="/gcloud-logo.png" alt="" />
        </div>
        <p className="text-2xl">
          Get ready to be on Cloud nine, we're getting the party started...
        </p>
      </div>
    );
  };
  
  export default LoadingSplash;
  