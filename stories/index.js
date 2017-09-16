import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';
import Cards, {Card} from '../src/index';

const data = ['Alexandre', 'Thomas', 'Lucien'];

const CustomAlertLeft = () => <span>Nop</span>;
const CustomAlertRight = () => <span>Ok</span>;

// eslint-disable-next-line no-undef
storiesOf('Tinder card', module)
  .add(
    'simple',
    withInfo({
      text: 'Simple example',
    })(() => (
      <div>
        <h1>react swipe card</h1>
        <Cards onEnd={action('end')}>
          {data.map((item, key) => (
            <Card
              key={key}
              onSwipeLeft={action('swipe left')}
              onSwipeRight={action('swipe right')}>
              <h2>{item}</h2>
            </Card>
          ))}
        </Cards>
      </div>
    )),
  )
  .add('custom alert', () => (
    <div>
      <h1>react swipe card</h1>
      <Cards
        alertRight={<CustomAlertRight />}
        alertLeft={<CustomAlertLeft />}
        onEnd={action('end')}>
        {data.map((item, key) => (
          <Card
            key={key}
            onSwipeLeft={action('swipe left')}
            onSwipeRight={action('swipe right')}>
            <h2>{item}</h2>
          </Card>
        ))}
      </Cards>
    </div>
  ))
  .add('all swipe directions', () => (
    <div>
      <h1>react swipe card</h1>
      <Cards onEnd={action('end')}>
        {data.map((item, key) => (
          <Card
            key={key}
            onSwipeTop={action('swipe top')}
            onSwipeBottom={action('swipe bottom')}
            onSwipeLeft={action('swipe left')}
            onSwipeRight={action('swipe right')}>
            <h2>{item}</h2>
          </Card>
        ))}
      </Cards>
    </div>
  ));
