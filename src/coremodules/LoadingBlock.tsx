import FadeTransition from "./FadeTransition";

type Props = {
  transparent?: boolean;
}

const LoadingBlock: React.FC<Props> = ({ transparent }) => {
  return (
    <FadeTransition speed='fast' className={`absolute w-full h-full ${transparent ? 'bg-black' : 'bg-white'} top-0 left-0 overflow-hidden !mt-0 rounded-xl flex justify-center items-center`}>
      <svg className='m-auto block' width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="30" cy="50" r="7" fill="#1A202C">
          <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"/>
        </circle>
        <circle cx="50" cy="50" r="7" fill="#4A5568">
          <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"/>
        </circle>
        <circle cx="70" cy="50" r="7" fill="#718096">
          <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"/>
        </circle>
      </svg>
    </FadeTransition>
  )
}

export default LoadingBlock;
