define([
    'IMSGlobal/jquery_2_1_1',
    'qtiCustomInteractionContext',
    'OAT/lodash',
    'OAT/util/event',
    'OAT/scale.raphael',
    'PARCC/pointFactory',
    'PARCC/axisFactory',
    'graphNumberLineInteraction/runtime/libs/intervalFactory'
], function($, qtiCustomInteractionContext, _, event, scaleRaphael, pointFactory, axisFactory, IntervalFactory){

    function createCanvas($container, config){

        var padding = 2;
        var width = 2 * padding + config.unitSize * (2 + config.max - config.min);
        var paper = scaleRaphael($('.shape-container', $container)[0], width, 120);

        return paper;
    }

    function buildAxisConfig(rawConfig){

        var _color = rawConfig.graphColor || '#266d9c';

        return {
            top : 60,
            left : 50,
            unitSize : 50,
            min : -5,
            max : 5,
            unitSubDivision : 2,
            arrows : true,
            plot : {
                color : _color,
                thickness : rawConfig.graphWidth || 5
            },
            point : {
                color : _color,
                radius : 10
            }
        };
    }

    function getAuthorizedIntervals(){
        return [
            'closed-closed',
            'closed-open',
            'open-closed',
            'open-open',
            'arrow-open',
            'arrow-closed',
            'open-arrow',
            'closed-arrow'
        ];
    }

    var graphNumberLineInteraction = {
        id : -1,
        getTypeIdentifier : function(){
            return 'graphNumberLineInteraction';
        },
        /**
         * Render the PCI : 
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function(id, dom, config){

            //add method on(), off() and trigger() to the current object
            event.addEventMgr(this);

            this.id = id;
            this.dom = dom;
            this.config = config || {};

            var $container = $(dom);

            var paper,
                axis,
                intervalFactory,
                _this = this;

            function initAxis($container, axisConfig){

                //create paper
                paper = createCanvas($container, axisConfig);
                axis = new axisFactory(paper, axisConfig);
                intervalFactory = new IntervalFactory(axis, axisConfig.plot);
            }

            function activate(uid){

                _.forIn(intervals, function(interval, id){
                    if(id === uid){
                        interval.$control.find('.btn').removeClass('btn-info').addClass('btn-success');
                        interval.obj.enable();
                    }else{
                        interval.$control.find('.btn').removeClass('btn-success').addClass('btn-info');
                        interval.obj.disable();
                    }
                });

            }

            function reset(){
                _.each(intervals, function(interval){
                    interval.obj.destroy();
                    interval.$control.remove();
                    $intervalsOverlay.hide();
                });
                intervals = {};
            }

            //expose the reset() method
            this.reset = function(){
                reset();
            };

            /**
             * init rendering:
             */
            this.axisConfig = buildAxisConfig(this.config);
            initAxis($container, this.axisConfig);

            var $intervalsAvailable = $container.find('.intervals-available');
            var $intervalsOverlay = $container.find('.intervals-overlay');
            var $intervalsSelected = $container.find('.intervals-selected');
            var $intervalTemplate = $container.find('.intervals-template .interval');
            var selectionMax = 2;
            var intervals = {};

            function setAvailableIntervals(availableIntervals){
                $intervalsAvailable.find('.interval-available').each(function(){
                    var $this = $(this);
                    if(_.indexOf(availableIntervals, $this.attr('value')) >= 0){
                        $this.addClass('activated');
                    }else{
                        $this.removeClass('activated');
                    }
                });
                //need to reset all
                reset();
            }

            var availableIntervals = this.config.intervals ? this.config.intervals.split(',') : getAuthorizedIntervals();
            setAvailableIntervals(availableIntervals);

            $container.on('click', '.intervals-available .btn-info', function(){

                if(_.size(intervals) < selectionMax){

                    var $button = $(this),
                        intervalType = $button.val(),
                        uid = _.uniqueId('interval_'),
                        $img = $button.find('img').clone();

                    //append button
                    var $tpl = $intervalTemplate.clone();
                    $tpl.find('.btn').append($img);
                    $tpl.attr('data-uid', uid);
                    $intervalsSelected.append($tpl);

                    //draw initial interval
                    var interval = intervalFactory.plot(intervalType, 0, 1);

                    intervals[uid] = {
                        type : intervalType,
                        obj : interval,
                        $control : $tpl
                    };

                    //active the button & interval editing
                    activate(uid);

                    if(_.size(intervals) === selectionMax){
                        //deactivate the whole panel
                        $intervalsOverlay.show();
                    }
                }

            }).on('click', '.intervals-selected .btn-info', function(){

                var $parent = $(this).parent('.interval'),
                    uid = $parent.data('uid');

                //active the button & interval editing
                activate(uid);

            }).on('click', '.intervals-selected .deleter', function(){

                var $deleter = $(this),
                    $parent = $deleter.parent('.interval'),
                    uid = $parent.data('uid'),
                    interval = intervals[uid];

                interval.obj.destroy();
                $parent.remove();
                intervals = _.omit(intervals, uid);

                if(_.size(intervals) <= selectionMax){
                    //re-enable buttons
                    $intervalsOverlay.hide();
                }

            });

            this.on('intervalschange', setAvailableIntervals);
        },
        /**
         * Programmatically set the response following the json schema described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         * 
         * @param {Object} interaction
         * @param {Object} response
         */
        setResponse : function(response){

        },
        /**
         * Get the response in the json format described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         * 
         * @param {Object} interaction
         * @returns {Object}
         */
        getResponse : function(){

            var value = 0;

            return {base : {integer : value}};
        },
        /**
         * Remove the current response set in the interaction
         * The state may not be restored at this point.
         * 
         * @param {Object} interaction
         */
        resetResponse : function(){
            this.reset();
        },
        /**
         * Reverse operation performed by render()
         * After this function is executed, only the inital naked markup remains 
         * Event listeners are removed and the state and the response are reset
         * 
         * @param {Object} interaction
         */
        destroy : function(){

            var $container = $(this.dom);
            $container.off().empty();
        },
        /**
         * Restore the state of the interaction from the serializedState.
         * 
         * @param {Object} interaction
         * @param {Object} serializedState - json format
         */
        setSerializedState : function(state){

        },
        /**
         * Get the current state of the interaction as a string.
         * It enables saving the state for later usage.
         * 
         * @param {Object} interaction
         * @returns {Object} json format
         */
        getSerializedState : function(){

            return {};
        }
    };

    qtiCustomInteractionContext.register(graphNumberLineInteraction);
});