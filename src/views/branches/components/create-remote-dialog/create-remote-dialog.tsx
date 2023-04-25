import * as React from 'react';
import {AppDialog} from '@components/dialog';
import {SharkTextInput} from '@components/shark-text-input';
import {ErrorMessageBox} from '@components/error-message-box';
import {SharkButton} from '@components/shark-button';
import {DynamicStyleSheet, useDynamicValue} from 'react-native-dynamic';
import {theme} from '@constants';
import {useTranslation} from 'react-i18next';

interface CreateRemoteDialogProps {
  onDismiss: (didUpdate: boolean) => void;
  visible: boolean;
  onRemoteCreate: (props: {remoteName: string; remoteURL: string}) => void;
  // The array of remote names, to validate user input against
  remotes: string[];
  errorStr: string;
}

export const CreateRemoteDialog = ({
  onDismiss,
  visible,
  onRemoteCreate,
  remotes,
  errorStr,
}: CreateRemoteDialogProps) => {
  const {t} = useTranslation();

  const styles = useDynamicValue(dynamicStyles);

  // const [branchName, setBranchName] = React.useState('');
  const [remoteName, setRemoteName] = React.useState('');
  const [remoteURL, setRemoteURL] = React.useState('');

  React.useEffect(() => {
    if (visible) return;
    // When dismissed via `visible=false`, reset the values within
    setRemoteName('');
  }, [visible]);

  const parentOnDismiss = (bool: boolean) => {
    setRemoteName('');
    setRemoteURL('');
    onDismiss(bool);
    if (bool) {
      onRemoteCreate({remoteName, remoteURL});
    }
  };

  const isNameTaken = remotes.includes(remoteName);

  return (
    <AppDialog
      visible={visible}
      onDismiss={() => parentOnDismiss(false)}
      title={t('createRemoteDialogTitle')}
      text={t('createRemoteDialogText')}
      main={
        <>
          <SharkTextInput
            placeholder={t('remoteUrlInput')}
            value={remoteURL}
            onChangeText={val => setRemoteURL(val)}
            postfixIcon={'paste'}
          />
          <SharkTextInput
            placeholder={t('remoteNameInput')}
            value={remoteName}
            onChangeText={val => setRemoteName(val)}
            style={styles.secondInput}
            errorStr={isNameTaken ? t('remoteNameTaken')! : ''}
          />
          {!!errorStr && (
            <ErrorMessageBox style={styles.errorBox} message={errorStr} />
          )}
        </>
      }
      actions={
        <>
          <SharkButton
            onPress={() => parentOnDismiss(false)}
            type="outline"
            style={styles.cancelBtn}
            text={t('cancelAction')}
          />
          <SharkButton
            onPress={() => parentOnDismiss(true)}
            type="primary"
            disabled={isNameTaken}
            text={t('createAction')}
          />
        </>
      }
    />
  );
};

const dynamicStyles = new DynamicStyleSheet({
  errorBox: {
    marginTop: theme.spacing.xs,
  },
  cancelBtn: {
    borderColor: theme.colors.tint_on_surface_01,
    borderWidth: theme.borders.thick,
    marginRight: theme.spacing.m,
  },
  secondInput: {
    marginTop: theme.spacing.xs,
  },
});
