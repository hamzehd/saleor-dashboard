import { Box, BoxProps } from "@saleor/macaw-ui/next";
import React from "react";

export const Divider = (props: BoxProps) => {
  return (
    <Box
      width="100%"
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderColor="neutralPlain"
      height={1}
      {...props}
    />
  );
};
