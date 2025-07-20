import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

interface WelcomeCardProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const WelcomeCard = ({ title, description, action }: WelcomeCardProps) => {
  return (
    <Card sx={{ maxWidth: '24rem' }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ marginBottom: '0.5rem' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      {action && (
        <CardActions>
          <Button size="small" onClick={action.onClick}>
            {action.label}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default WelcomeCard;
