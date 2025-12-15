import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Image } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import NotificationAlert from '@ProcarefulAdmin/components/NotificationAlert';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { downloadFile } from '@ProcarefulAdmin/utils/downloadFile';
import {
  caregiverControllerGetUserAssessmentReport,
  getCaregiverControllerGetUserAssessmentReportQueryKey,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Paragraph, Title } from '@Procareful/ui';
import { formatStringToPdf } from './helpers';
import { useStyles } from './styles';

const DownloadAssessmentReport = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const seniorIdParam = searchParams.get(SearchParams.Id);
  const assessmentIdParam = searchParams.get(SearchParams.AssessmentId);
  const seniorId = Number(seniorIdParam);
  const assessmentId = Number(assessmentIdParam);

  const handleRedirectToAssignActivities = () => {
    if (!seniorIdParam) {
      return;
    }

    navigate({
      pathname: PathRoutes.SeniorAddAssignActivities,
      search: new URLSearchParams({
        [SearchParams.Id]: seniorIdParam,
      }).toString(),
    });
  };

  const handleDownloadDocument = async () => {
    try {
      setIsLoading(true);

      const downloadedFile: Blob = await queryClient.fetchQuery({
        queryKey: getCaregiverControllerGetUserAssessmentReportQueryKey(seniorId, assessmentId),
        queryFn: () =>
          caregiverControllerGetUserAssessmentReport(seniorId, assessmentId, {
            responseType: 'blob',
          }),
      });

      if (!downloadedFile) {
        return;
      }

      const blob = new Blob([downloadedFile], { type: 'application/octet-stream' });
      downloadFile(blob, formatStringToPdf(t('admin_inf_senior_assessment_report')));

      notificationApi.success({
        message: t('admin_alert_document_downloaded_successfully_title'),
        description: t('admin_alert_document_downloaded_successfully_subtitle'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const seniorProfileRedirectionConfig = {
    pathname: PathRoutes.SeniorProfile,
    search: new URLSearchParams({
      [SearchParams.Id]: seniorId.toString(),
    }).toString(),
  };

  return (
    <div className={styles.container}>
      <div className={styles.downloadContainer}>
        <div className={styles.titleContainer}>
          <Title level={5}>{t('admin_title_download_assessment_report')}</Title>
          <Paragraph>{t('admin_inf_download_assessment_report_subtitle')}</Paragraph>
        </div>
        <NotificationAlert
          title={t('admin_alert_download_assessment_report_now')}
          className={styles.alert}
        />
        <Image src="/assessment-report.png" width={196} height={278} preview={false} />
        <Button
          className={styles.downloadButton}
          type="primary"
          loading={isLoading}
          onClick={handleDownloadDocument}
        >
          {t('admin_btn_download_assessment_report')}
        </Button>
      </div>
      <FormControls
        containerClassName={styles.buttonGroup}
        resetButtonText={t('shared_btn_cancel')}
        confirmButtonText={t('admin_btn_go_to_activity_assignment')}
        onSubmit={handleRedirectToAssignActivities}
        onReset={() => navigate(seniorProfileRedirectionConfig)}
      />
    </div>
  );
};

export default DownloadAssessmentReport;
