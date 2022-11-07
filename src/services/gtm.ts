const event = (
  eventName: string,
  event_label: string,
  non_interaction: boolean = false,
) => {
  const event_category = `The Eras Tour`;
  gtag('event', eventName, {
    event_category,
    event_label,
    non_interaction,
  });
};

export const clickLogin = () => {
  event(
    `Click login`,
    `Click login`
  );
};

export const clickGuest = () => {
  event(
    `Click guest`,
    `Click guest`,
    true,
  );
};

export const successfulLogin = () => {
  event(
    `Successful login`,
    `Successful login`,
    true,
  );
};

export const clickPrev = (step: number) => {
  event(
    `Click prev step ${step}`,
    `Step ${step}`
  );
};

export const clickNext = (step: number) => {
  event(
    `Click next step ${step}`,
    `Step ${step}`
  );
};

export const clickTrack = (name: string) => {
  event(
    `Click select track ${name}`,
    `${name}`
  );
};

export const showSetlist = (tracks: number, duration: string) => {
  event(
    `Show setlist, ${tracks} tracks - ${duration}`,
    `${tracks} tracks - ${duration}`
  );
};

export const clickCreatePlaylist = () => {
  event(
    `Click create playlist`,
    `Click create playlist`
  );
};

export const clickViewPlaylist = () => {
  event(
    `Click view playlist`,
    `Click view playlist`
  );
};

export const clickShare = () => {
  event(
    `Click share`,
    `Click share`
  );
};

export const clickSaveScreenshot = () => {
  event(
    `Click save screenshot`,
    `Click save screenshot`
  );
};