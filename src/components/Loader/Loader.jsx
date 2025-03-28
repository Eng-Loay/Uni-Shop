import React from 'react'
import { CirclesWithBar } from 'react-loader-spinner'

function Loader() {
  return (
    <>
    <CirclesWithBar
  height="100"
  width="100"
  color="#001F54"
  outerCircleColor="#001F54"
  innerCircleColor="#001F54"
  barColor="#001F54"
  ariaLabel="circles-with-bar-loading"
  wrapperStyle={{}}
  wrapperClass="h-screen flex justify-center items-center"
  visible={true}
  />
    </>
  )
}

export default Loader