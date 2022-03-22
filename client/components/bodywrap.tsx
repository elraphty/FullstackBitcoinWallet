import type { NextPage } from 'next';

const BodyWrap: NextPage = (props) => {
  return (
    <div className='bodywrap'>
      {props.children}
    </div>
  )
}

export default BodyWrap;