import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';

import MyPopup from '@components/MyPopup';
import {makeStyles} from '@rneui/themed';
import {
  StatusCancel,
  StatusHistory,
  StatusLinking,
  StatusQueue,
} from './TopicLinkStatus';

import useStateRef from '@utils/useStateRef';
import {
  createListen,
  getListenStatus,
  updateDialogStatus,
  listHistory,
} from '@api/index';
import {listenStore} from '@store/listenStore';
import {userStore} from '@store/userStore';

const StatusCode = {
  QUEUE: 0,
  HISTORY: 1,
  LINKING: 2,
  CANCEL: -1,
};

/**
 *
 * @param {*} linkTopic 指定话题
 * @param {*} linkListener 指定倾听师
 * @param {*} onSuccess 连接成功回调
 * @param {*} onClosed 关闭成功回调 (isLogout)
 * @returns
 */
const TopicLinkDialog = ({
  visible,
  setVisible,
  linkTopic,
  linkListener,
  onSuccess,
  onClosed,
  isExclude,
}) => {
  const styles = useStyles();

  // 连接状态
  const [status, setStatus, statusRef] = useStateRef(StatusCode.QUEUE);
  const waitKeyRef = useRef('');
  const timer = useRef(null);
  // 历史倾听师
  const [history, setHistory] = useState([]);

  const closeDialog = (isLogout) => {
    setStatus(StatusCode.QUEUE);
    if (isLogout) {
      userStore.clearUserCache();
    }
    setVisible(false);
    onClosed?.(isLogout);
  };

  const fetchHistory = () => {
    listHistory()
      .then((res) => {
        setStatus(StatusCode.HISTORY);
        if (!res.data || res.data.length == 0) {
          // 无历史倾听师
          fetchQueueInfo();
          return;
        }
        setHistory(res.data || []);
      })
      .catch(() => {
        fetchQueueInfo();
      });
  };

  // 创建排队 task
  const fetchQueueInfo = (_teacherId) => {
    // 指定倾听师id
    _teacherId = _teacherId || linkListener?.teacherId;

    const data = {
      topic: linkTopic.name,
    };
    // 指定该 ID
    if (!isExclude && _teacherId) {
      data.teacherId = _teacherId;
    }
    // 排除该 ID
    if (isExclude && _teacherId) {
      data.params = {excludeTeacherIds: [_teacherId]};
    }
    setStatus(StatusCode.QUEUE);
    createListen(data).then((res) => {
      if (statusRef.current != StatusCode.QUEUE) {
        return; // 状态已改变
      }
      if (!res.data) return;

      listenStore.setTask(res.data);
      waitKeyRef.current = res.data.waitKey;
      // 定时获取
      timer.current = setTimeout(() => {
        fetchQueueStatus();
      }, res.data.waitTime * 1000);
    });
  };

  // 查询排队状态，获取倾听师信息
  const fetchQueueStatus = () => {
    if (!waitKeyRef.current) return;
    getListenStatus({
      waitKey: waitKeyRef.current,
    }).then((res) => {
      if (!visible || statusRef.current != StatusCode.QUEUE) {
        return; // 状态已改变
      }
      if (!res.data) return;

      if (res.data.teacherId && res.data.calledNo) {
        // 排队结束，倾听师信息 res.data
        fetchLinkAndCall(res.data);
        return;
      }

      // 否则，继续排队
      listenStore.setTask(res.data);
      waitKeyRef.current = res.data.waitKey;
      // 定时获取
      timer.current = setTimeout(() => {
        fetchQueueStatus();
      }, res.data.waitTime * 1000);
    });
  };

  // 准备就绪，缓存信息
  const fetchLinkAndCall = (_listener) => {
    setStatus(StatusCode.LINKING);
    // 缓存倾听信息
    listenStore.setTopic(linkTopic);
    listenStore.setListener(_listener);
    // 获取倾听者信息，跳转拨打页
    closeDialog();

    // 成功
    onSuccess?.();
  };

  const clickToCancel = () => {
    // 由组件处理取消逻辑
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setStatus(StatusCode.CANCEL);

    if (!listenStore.task?.dialogId) return;
    // 更新 log状态
    updateDialogStatus({
      id: listenStore.task.dialogId,
      status: 10, // 用户取消
      waitKey: waitKeyRef.current,
    }).catch(() => {});
  };

  // init data
  const initData = () => {
    listenStore.resetListen();

    if (linkTopic?.name) {
      listenStore.setTopic(linkTopic);
    }
    if (linkListener?.teacherId) {
      listenStore.setListener(linkListener);
    }
    setHistory([]);
    setStatus(StatusCode.QUEUE);

    // return;

    if (linkListener?.teacherId) {
      // 指定了倾听师，或排除该倾听师（不调历史）
      fetchQueueInfo();
    } else {
      // 查询历史倾听师
      fetchHistory();
    }
  };

  useEffect(() => {
    if (!visible) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    if (!linkTopic?.name) return;

    initData();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [visible]);

  // ===Status Components===

  return (
    <MyPopup isVisible={visible}>
      {status == StatusCode.QUEUE && (
        <StatusQueue
          topic={linkTopic}
          task={listenStore.task}
          onPress={() => clickToCancel()}
        />
      )}

      {status == StatusCode.HISTORY && (
        <StatusHistory
          items={history}
          onClickItem={(item) => {
            fetchQueueInfo(item.teacherId);
          }}
          onPress={() => fetchQueueInfo()}
        />
      )}

      {status == StatusCode.LINKING && (
        <StatusLinking topic={linkTopic} onPress={() => clickToCancel()} />
      )}

      {status == StatusCode.CANCEL && (
        <StatusCancel
          topic={linkTopic}
          onFinished={() => closeDialog(true)}
          onPress={() => closeDialog()}
        />
      )}
    </MyPopup>
  );
};

export default observer(TopicLinkDialog);

const useStyles = makeStyles((theme) => ({
  wrap: {},
}));
