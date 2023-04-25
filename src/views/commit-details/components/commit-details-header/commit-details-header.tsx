import * as React from 'react';
import {Animated, Text, View} from 'react-native';
import {DynamicStyleSheet, useDynamicValue} from 'react-native-dynamic';
import {CommitDetailsDualAuthor} from './commit-detail-dual-author';
import {CommitDetailsSingleAuthor} from './commit-detail-single-author';
import {theme} from '@constants';
import {DropdownContent} from '@components/dropdown-content';
import {AnimatedDropdownArrow} from '@components/animated-dropdown-arrow';
import {TouchableRipple} from 'react-native-paper';
import {CommitDetailsMoreInfo} from './commit-details-more-info';
import {CommitMessageDropdown} from './commit-message-dropdown';
import {GitLogCommit} from '@services';
import {useTranslation} from 'react-i18next';

interface CommitDetailsHeaderProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  messageExpanded: boolean;
  setMessageExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  committer: GitLogCommit['committer'];
  author?: GitLogCommit['author'];
  title: string;
  sha: string;
  parents: string[];
  onNavToPar: (val: string) => void;
}

export const CommitDetailsHeader = ({
  expanded,
  setExpanded,
  messageExpanded,
  setMessageExpanded,
  message,
  committer,
  author,
  title,
  sha,
  parents,
  onNavToPar,
}: CommitDetailsHeaderProps) => {
  const {t} = useTranslation();

  const styles = useDynamicValue(dynamicStyles);
  const [showMoreInfoOpacity] = React.useState(new Animated.Value(0));
  const [showLessInfoOpacity] = React.useState(new Animated.Value(0));

  const showOne = !author || author.email === committer.email;

  React.useEffect(() => {
    if (expanded) {
      Animated.parallel([
        Animated.timing(showMoreInfoOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(showLessInfoOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(showMoreInfoOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(showLessInfoOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [expanded, showMoreInfoOpacity, showLessInfoOpacity]);

  return (
    <View>
      <Text style={styles.commitStyle} accessibilityRole={'header'}>
        {title}
      </Text>
      {!!message && (
        <CommitMessageDropdown
          message={message}
          expanded={messageExpanded}
          setExpanded={setMessageExpanded}
        />
      )}
      {showOne && (
        <CommitDetailsSingleAuthor
          style={styles.authorBlock}
          committer={committer}
          author={author}
        />
      )}
      {!showOne && (
        <CommitDetailsDualAuthor
          expanded={expanded}
          style={styles.authorBlock}
          committer={committer}
          author={author}
        />
      )}
      <DropdownContent expanded={expanded}>
        <CommitDetailsMoreInfo
          sha={sha}
          parents={parents}
          onNavToPar={onNavToPar}
        />
      </DropdownContent>
      <TouchableRipple
        style={styles.dropdownContainer}
        onPress={() => setExpanded(v => !v)}
        accessibilityRole={'button'}
        accessibilityState={{expanded}}
        accessible={true}
        accessibilityLabel={t('moreInfo')!}>
        <>
          <AnimatedDropdownArrow expanded={expanded} />
          <View style={styles.dropdropTextContainer}>
            <Animated.Text
              style={[styles.dropdownText, {opacity: showMoreInfoOpacity}]}>
              {t('moreInfo')}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.dropdownText,
                styles.showLess,
                {opacity: showLessInfoOpacity},
              ]}>
              {t('lessInfo')}
            </Animated.Text>
          </View>
        </>
      </TouchableRipple>
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  commitStyle: {
    ...theme.textStyles.callout_01,
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.xs,
    color: theme.colors.label_high_emphasis,
  },
  authorBlock: {
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.m,
  },
  dropdownContainer: {
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.l,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    ...theme.textStyles.caption_01,
    color: theme.colors.primary,
    marginLeft: theme.spacing.m,
    flexGrow: 1,
    textAlignVertical: 'center',
  },
  dropdropTextContainer: {
    position: 'relative',
  },
  showLess: {
    position: 'absolute',
    height: '100%',
  },
});
