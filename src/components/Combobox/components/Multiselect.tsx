import { ChangeEvent } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import {
  DynamicMultiselect,
  DynamicMultiselectProps,
  Option,
} from "@saleor/macaw-ui/next";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { useCombbobxCustomOption } from "../hooks/useCombbobxCustomOption";
import { useComboboxHandlers } from "../hooks/useComboboxHandlers";
import { toWithCustomValues } from "../utils";

type MultiselectProps = Omit<DynamicMultiselectProps<Option>, "onChange"> & {
  options: Option[];
  fetchOptions: (data: string) => void;
  alwaysFetchOnFocus?: boolean;
  allowCustomValues?: boolean;
  fetchMore?: FetchMoreProps;
  onChange: (event: ChangeEvent) => void;
};

export const Multiselect = ({
  disabled,
  options,
  onChange,
  fetchOptions,
  value,
  alwaysFetchOnFocus = false,
  allowCustomValues = false,
  loading,
  fetchMore,
  size = "small",
  ...rest
}: MultiselectProps) => {
  const intl = useIntl();
  const inputValue = useRef("");

  const [selectedValues, setSelectedValues] = useState(value);

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  const { handleFetchMore, handleFocus, handleInputChange } =
    useComboboxHandlers({
      fetchOptions,
      alwaysFetchOnFocus,
      fetchMore,
    });

  const { customValueLabel, customValueOption } = useCombbobxCustomOption({
    query: inputValue.current,
    allowCustomValues,
    selectedValue: selectedValues,
  });

  const handleOnChange = (values: Option[]) => {
    const hasCustomValue = values.find(value =>
      value.label.includes(customValueLabel),
    );
    const valuesWithCustom = values.map(toWithCustomValues(customValueLabel));

    onChange({
      target: {
        value: valuesWithCustom,
        name: rest.name ?? "",
      },
    });

    inputValue.current = "";

    if (hasCustomValue) {
      fetchOptions("");
    }
  };

  return (
    <DynamicMultiselect
      options={[...customValueOption, ...options]}
      disabled={disabled}
      onChange={handleOnChange}
      value={selectedValues}
      onInputValueChange={value => {
        inputValue.current = value;
        handleInputChange(value);
      }}
      onFocus={handleFocus}
      onScrollEnd={handleFetchMore}
      loading={loading || fetchMore?.hasMore || fetchMore?.loading}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      size={size}
      {...rest}
    />
  );
};
