declare namespace Style {
  type Margin = {
    marginTop?: number | string;
    marginRight?: number | string;
    marginBottom?: number | string;
    marginLeft?: number | string;
  };
  type Padding = {
    paddingTop?: number | string;
    paddingRight?: number | string;
    paddingBottom?: number | string;
    paddingLeft?: number | string;
  };
  type Flex = {
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number | string;
  };
  type BorderStyle = 'solid' | 'dotted' | 'dashed';
  type Border = {
    borderColor?: string;
    borderStyle?: BorderStyle;
    borderWidth?: number;
    borderTopWidth?: number;
    borderRightWidth?: number;
    borderBottomWidth?: number;
    borderLeftWidth?: number;
  };
  type BorderColor = {
    borderColor?: string;
    borderTopColor?: string;
    borderRightColor?: string;
    borderBottomColor?: string;
    borderLeftColor?: string;
  };
}
