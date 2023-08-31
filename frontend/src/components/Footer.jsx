const Footer = () => {
  return (


<footer className="bg-white dark:bg-gray-900 mt-20">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-10 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-5">
              <a className="flex items-center">
                  <img src="/favicon.ico" className="h-8 mr-3" alt="FlowBite Logo" />
                  <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Central Lab</span>
              </a>
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://www.al-enterprise.com/" className="hover:underline">Alcatel-Lucent Enterprise®</a>. All Rights Reserved.
          </span>
          
      </div>
    </div>
</footer>


  )
}

export default Footer