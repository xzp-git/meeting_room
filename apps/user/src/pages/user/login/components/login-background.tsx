// @ts-nocheck
import { createStyles } from 'antd-style';
import 'css-doodle';
import { useEffect, useRef } from 'react';

const useStyles = createStyles(({ css }) => {
  return {
    loginContainer: css`
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 12;
      &::after {
        content: '';
        position: absolute;
        top: 10vmin;
        right: 20vmin;
        background: #fff;
        width: 8vh;
        height: 8vh;
        border-radius: 50%;
        box-shadow: 0 0 20px 2px rgba(253, 220, 189, 0.9);
      }
    `,
  };
});

const LoginBackground = () => {
  const { styles } = useStyles();
  const handle = function (e) {
    e.target?.update();
  };
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    divRef.current?.addEventListener('click', handle);
    return () => {
      divRef.current?.removeEventListener('click', handle);
    };
  }, []);
  return (
    <div className={styles.loginContainer} ref={divRef}>
      <css-doodle>
        {`
            :doodle { @grid: 35 x 1 / 100vw 100vh; } 
            :container { 
                background: #ffcabb; 
                background: linear-gradient(to top, #ffcabb 50%, #de93b6 100%); 
                background-repeat: no-repeat; 
            } 
            
            position: relative; 
            align-self: end;
            height: @rand(10%, 75%);
            background: linear-gradient(to
            top, #725392 0%, #b764ac 100%);
            margin-left: @rand(0.1, 1)vw;
            z-index: 1;
            transform: scaleX(@rand(.8, 1.9));
            
            ::before { 
                content: ""; 
                position: absolute; 
                bottom: 0; 
                left: @rand(-20, 12)px; 
                right: @rand(-20, 12)px; 
                top: @rand(15, 55)%; 
                background: linear-gradient(to
                top, #352864 0%, #4d4280 100%); 
                z-index: 3; 
            } 
            
            ::after { 
                content: "";
                position: absolute;
                width: .1vw;
                height: .12vw;
                top: @rand(15, 20)%;
                left: @rand(10, 20)%;
                z-index: 5;
                box-shadow: 
                    @rand(0.1, 2.1)vw @rand(0, 10)vh .5px rgba(246, 212, 0, .7),
                    @rand(0.1, 2.1)vw @rand(10, 15)vh .5px rgba(246, 212, 0, .6), 
                    @rand(0.1, 2.1)vw @rand(15, 22)vh .5px rgba(246, 212, 0, .7), 
                    @rand(0.1, 2.1)vw @rand(22, 30)vh .5px rgba(246, 212, 0, .6), 
                    @rand(0.1, 2.1)vw @rand(30, 40)vh .5px rgba(246, 212, 0, .8);
            }
        `}
      </css-doodle>
    </div>
  );
};

export default LoginBackground;
