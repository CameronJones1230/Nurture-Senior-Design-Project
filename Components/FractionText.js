import React from 'react';
import Svg, { Text, TSpan } from 'react-native-svg';

const FractionText = ({ topText, bottomText, fontSize = 14, color = '#000', fontFamily = 'Montserrat_Regular' }) => {
    const svgWidth = fontSize * 2.6; // Adjust SVG width based on font size
    const svgHeight = fontSize * 2; // Adjust SVG height to fit fraction text

    return (
        <Svg height={svgHeight} width={svgWidth}>
            {/* Top text (numerator) */}
            <Text
                x="50%" // Center text horizontally
                y={fontSize} // Adjust vertical position of numerator
                fontSize={fontSize}
                fontFamily={fontFamily}
                fill={color}
                textAnchor="middle" // Align text to the center
            >
                {topText}
            </Text>
            {/* Bottom text (denominator) */}
            <Text
                x="50%" // Center text horizontally
                y={fontSize * 1.85} // Adjust vertical position of denominator
                fontSize={fontSize * 0.9} // Slightly smaller font for denominator
                fill={color}
                textAnchor="middle"
                fontFamily={fontFamily}
            >
                {bottomText}
            </Text>
        </Svg>
    );
};

export default FractionText;
