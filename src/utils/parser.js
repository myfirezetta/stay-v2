export const SYMBOL_PATTERNS = {
  projects: /(#p|#project):\[([^\]]+)\]/g,
  tasks: /(#t|#task):\[([^\]]+)\]/g,
  issues: /(#i|#issue):\[([^\]]+)\]/g,
  tickets: /(#tk|#ticket):\[([^\]]+)\]/g,
  systems: /(#sys|#system):\[([^\]]+)\]/g,
  users: /(@u|@user):\[([^\]]+)\]/g,
  groups: /(@g|@group):\[([^\]]+)\]/g,
  departments: /(@d|@dept):\[([^\]]+)\]/g,
  milestones: /(\*m|\*milestone):\[([^\]]+)\]/g,
  dates: /(\*d|\*date|\*deadline):\[([^\]]+)\]/g,
};

export const parseFeedContent = (content) => {
  let tags = [];
  
  Object.keys(SYMBOL_PATTERNS).forEach((key) => {
    const regex = new RegExp(SYMBOL_PATTERNS[key]);
    let match;
    while ((match = regex.exec(content)) !== null) {
      tags.push({
        type: key,
        raw: match[0],
        prefix: match[1],
        value: match[2],
        index: match.index
      });
    }
  });

  return tags.sort((a, b) => a.index - b.index);
};

export const getBadgeColor = (type) => {
  switch (type) {
    case 'projects': return { bg: 'var(--color-project-bg)', text: 'var(--color-project-text)' };
    case 'tasks': return { bg: 'var(--color-task-bg)', text: 'var(--color-task-text)' };
    case 'issues': 
    case 'tickets': return { bg: 'var(--color-ticket-bg)', text: 'var(--color-ticket-text)' };
    case 'systems': return { bg: 'var(--color-system-bg)', text: 'var(--color-system-text)' };
    case 'users': return { bg: 'var(--color-user-bg)', text: 'var(--color-user-text)' };
    case 'groups': return { bg: 'var(--color-group-bg)', text: 'var(--color-group-text)' };
    case 'departments': return { bg: 'var(--color-dept-bg)', text: 'var(--color-dept-text)' };
    case 'milestones': return { bg: 'var(--color-milestone-bg)', text: 'var(--color-milestone-text)' };
    case 'dates': return { bg: 'var(--color-date-bg)', text: 'var(--color-date-text)' };
    default: return { bg: 'var(--color-neutral-bg)', text: 'var(--color-neutral-text)' };
  }
};
