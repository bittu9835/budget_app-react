import { FC } from 'react';
import "frappe-datatable/dist/frappe-datatable.min.css";
// const DataTable = require('frappe-datatable');

interface CalculatorProps {}

const Calculator: FC<CalculatorProps> = () => {
    // useEffect(() => {
    //     const dataTable = document.getElementById('calpage');

    //     if (dataTable) {
    //         const datatable = new DataTable(dataTable, {
    //             columns: ['Framework', 'Built By', 'GitHub Stars', 'License', 'Contributors', 'Age', 'Project Home', 'Project Link'],
    //             data: [
    //                 ['React', 'Facebook', 149017, 'MIT', 1385, '7 Years', 'https://reactjs.org', 'https://github.com/facebook/react'],
    //                 ['Angular', 'Google', 61263, 'MIT', 1119, '5 Years', 'https://angular.io', 'https://github.com/angular/angular'],
    //                 ['Vue', 'Evan You', 164408, 'MIT', 293, '4 Years', 'https://vuejs.org', 'https://github.com/vuejs/vue'],
    //                 ['Svelte', 'Rich Harris', 33865, 'MIT', 298, '3 Years', 'https://svelte.dev', 'https://github.com/sveltejs/svelte/'],
    //                 ['Stencil', 'Ionic Team', 7749, 'MIT', 132, '3 Years', 'https://stenciljs.com', 'https://github.com/ionic-team/stencil'],
    //             ]
    //         });
    //         console.log(datatable, 'datatable');
    //     } else {
    //         console.warn('Element #calpage not found');
    //     }
    // }, []); // Runs once on component mount

    return (
        <div id='calpage' className='bg-white flex w-full h-full'>
        </div>
    );
};

export default Calculator;
