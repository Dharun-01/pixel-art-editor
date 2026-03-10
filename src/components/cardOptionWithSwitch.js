import { elt } from '../utils';
export function createCardOptionWithSwitch(optionText, checkBox) {
	return elt(
		'label',
		{ htmlFor: optionText },
		elt(
			'p',
			{
				className: 'p-1 min-w-52 hover:bg-custom-glass-black rounded-md',
			},
			elt(
				'div',
				{
					className: 'flex flex-row items-center justify-between',
				},
				optionText,
				elt(
					'label',
					{
						className: 'switch ',
					},
					checkBox,
					elt('span', { className: 'slider round' }),
				),
			),
		),
	);
}
