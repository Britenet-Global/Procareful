import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStyles } from './styles';

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

const streamUrl = (id: string | null) => (id ? `${BASE_URL}/api/user/video/stream/${id}` : '');

const VideoView = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get(SearchParams.Id);

  return (
    <TopBarLayout onClick={() => navigate(-1)}>
      <video width="600" controls className={styles.videoContainer}>
        <source src={streamUrl(videoId)} type="video/mp4" />
        {t('senior_inf_your_browser_does_not_support_video')}
      </video>
    </TopBarLayout>
  );
};

export default VideoView;
