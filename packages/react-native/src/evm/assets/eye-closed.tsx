import { IconStyleProp } from "./types";
import Svg, { Path } from "react-native-svg";

const EyeClosed = ({ width, height, color }: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 256 256" fill="none">
      <Path
        d="M234.42 162C235.208 163.369 235.719 164.879 235.923 166.445C236.127 168.01 236.021 169.601 235.611 171.126C235.2 172.651 234.494 174.08 233.531 175.331C232.568 176.583 231.368 177.632 230 178.42C228.632 179.208 227.121 179.719 225.556 179.923C223.99 180.128 222.399 180.022 220.875 179.611C219.35 179.201 217.921 178.494 216.669 177.531C215.418 176.569 214.368 175.369 213.58 174L196.72 144.5C187.312 150.419 177.169 155.078 166.55 158.36L171.84 190C172.36 193.139 171.613 196.356 169.762 198.944C167.911 201.532 165.108 203.279 161.97 203.8C161.31 203.917 160.64 203.974 159.97 203.97C157.136 203.968 154.395 202.962 152.232 201.132C150.068 199.301 148.622 196.765 148.15 193.97L143 163.17C133.011 164.277 122.929 164.277 112.94 163.17L107.84 194C107.367 196.798 105.918 199.337 103.751 201.168C101.583 202.999 98.8372 204.002 96 204C95.3296 204.004 94.6603 203.947 94 203.83C92.4457 203.569 90.9582 203.003 89.6224 202.167C88.2867 201.33 87.1288 200.238 86.2151 198.954C85.3013 197.67 84.6495 196.218 84.2969 194.682C83.9443 193.145 83.8978 191.555 84.16 190L89.45 158.28C78.8309 154.998 68.6879 150.339 59.28 144.42L42.42 174C41.6321 175.369 40.5823 176.569 39.3307 177.531C38.0791 178.494 36.6502 179.201 35.1254 179.611C33.6007 180.022 32.01 180.128 30.4443 179.923C28.8786 179.719 27.3684 179.208 26 178.42C24.6316 177.632 23.4319 176.583 22.4692 175.331C21.5065 174.08 20.7997 172.651 20.3893 171.126C19.9789 169.601 19.8728 168.01 20.0771 166.445C20.2814 164.879 20.7921 163.369 21.58 162L40 129.85C33.7569 124.212 27.9689 118.09 22.69 111.54C20.8264 109.055 19.9994 105.943 20.3828 102.861C20.7663 99.7779 22.3303 96.9639 24.746 95.0106C27.1617 93.0573 30.2408 92.117 33.3355 92.3874C36.4303 92.6578 39.2997 94.1178 41.34 96.4604C57.38 116.32 85.44 140 128 140C170.56 140 198.62 116.32 214.66 96.4604C216.667 94.0083 219.563 92.4497 222.715 92.1248C225.868 91.7999 229.021 92.7351 231.486 94.7264C233.951 96.7176 235.529 99.6031 235.874 102.753C236.22 105.903 235.305 109.062 233.33 111.54C228.045 118.091 222.25 124.213 216 129.85L234.42 162Z"
        fill={color}
      />
    </Svg>
  );
};

export default EyeClosed;
