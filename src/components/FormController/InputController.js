import {Controller} from 'react-hook-form';

import {Input, InputProps, makeStyles} from '@rneui/themed';

/**
 * input controller (react-hook-form)
 * @param {InputProps} props
 * @returns
 */
export const InputController = ({control, errors, rules, name, ...attrs}) => {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({field: {value, onChange, onBlur}}) => (
        <Input
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          containerStyle={styles.wrap}
          labelStyle={styles.label}
          inputContainerStyle={styles.input}
          errorMessage={errors[name]?.message}
          {...attrs}
        />
      )}
    />
  );
};

const useStyles = makeStyles(theme => ({
  wrap: {
    paddingHorizontal: 0,
  },
  input: {
    borderBottomWidth: 0,
    backgroundColor: '#ecf7ff',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  label: {
    marginBottom: 5,
    color: theme.colors.primary,
  },
}));
