import React from 'react';
import {observer, useLocalObservable} from 'mobx-react';
import {runInAction} from 'mobx';
import { Provider } from 'mobx-react';

interface IIssue {
  // data
}

const useMainLocalStore = () => {
  const masterStore = useLocalObservable(() => ({
    data: {} as IIssue,
    get(key: string) {
      return masterStore.data[key]
    },
    set(key, value) {
      runInAction(function () {
        masterStore.data[key] = value
      })
    }
  }));
  return masterStore;
};

const MasterStoreProvider: React.FC<any> = observer((props) => {
  const {children} = props;
  const masterStore = useMainLocalStore();
  return <Provider masterStore={masterStore}>{children}</Provider>;
});

export {MasterStoreProvider};
