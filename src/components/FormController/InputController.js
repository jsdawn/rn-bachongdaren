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
          errorStyle={styles.errorStyle}
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
    height: 50,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  errorStyle: {
    margin: 4,
    padding: 0,
    color: theme.colors.error,
  },
  label: {
    marginBottom: 5,
  },
}));
