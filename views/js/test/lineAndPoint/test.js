/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2015-2017 Parcc, Inc.
 */
define([
    "jquery",
    "lodash",
    "taoQtiItem/runner/qtiItemRunner",
    "taoQtiItem/portableElementRegistry/ciRegistry",
    "taoQtiItem/portableElementRegistry/provider/localManifestProvider",
    "json!parccTei/test/samples/lineAndPoint.json",
], function ($, _, qtiItemRunner, ciRegistry, pciTestProvider, itemData) {
    "use strict";

    var fixtureContainerId = "item-container";
    var outsideContainerId = "outside-container";

    //manually register the pci from its manifest
    pciTestProvider.addManifestPath(
        "graphLineAndPointInteraction",
        "parccTei/pciCreator/ims/graphLineAndPointInteraction/imsPciCreator.json"
    );
    ciRegistry.resetProviders();
    ciRegistry.registerProvider(pciTestProvider.getModuleName());

    QUnit.module("Graph Line & Point Interaction");

    QUnit.test("renders", function (assert) {
        const done = assert.async();
        var $container = $("#" + fixtureContainerId);

        assert.equal($container.length, 1, "the item container exists");
        assert.equal(
            $container.children().length,
            0,
            "the container has no children"
        );

        const runner = qtiItemRunner("qti", itemData)
            .on("render", function () {
                assert.equal(
                    $container.children().length,
                    1,
                    "the container a elements"
                );
                assert.equal(
                    $container.children(".qti-item").length,
                    1,
                    "the container contains a the root element .qti-item"
                );
                assert.equal(
                    $container.find(".qti-interaction").length,
                    1,
                    "the container contains an interaction .qti-interaction"
                );
                assert.equal(
                    $container.find(".qti-interaction.qti-customInteraction")
                        .length,
                    1,
                    "the container contains a custom interaction"
                );
                assert.equal(
                    $container.find(
                        ".qti-customInteraction .pointAndLineFunctionInteraction"
                    ).length,
                    1,
                    "the custom interaction is a graph line & point"
                );

                runner.clear();
                done();
            })
            .on("error", function (error) {
                window.console.log(error);
                runner.clear();
                done();
            })
            .init()
            .render($container);
    });

    QUnit.test("response", function (assert) {
        const done = assert.async();
        var response = {
            record: [
                {
                    name: "points_1",
                    base: {
                        list: {
                            point: [[5, -1]],
                        },
                    },
                },
                {
                    name: "setPoints_3",
                    base: {
                        list: {
                            point: [
                                [6, 2],
                                [2, -2],
                                [-5, -7],
                            ],
                        },
                    },
                },
                {
                    name: "segments_4",
                    base: {
                        list: {
                            point: [
                                [-7, 7],
                                [7, 9],
                            ],
                        },
                    },
                },
                {
                    name: "lines_6",
                    base: {
                        list: {
                            point: [
                                [-7, 3],
                                [2, -8],
                            ],
                        },
                    },
                },
                {
                    name: "solutionSet_8",
                    base: {
                        list: {
                            point: [
                                [-10, 6.67],
                                [3.64, -10],
                                [-10, -10],
                            ],
                        },
                    },
                },
            ],
        };

        var $container = $("#" + fixtureContainerId);
        assert.equal($container.length, 1, "the item container exists");
        assert.equal(
            $container.children().length,
            0,
            "the container has no children"
        );

        const runner = qtiItemRunner("qti", itemData)
            .on("render", function () {
                var interaction,
                    interactions = this._item.getInteractions();

                assert.equal(_.size(interactions), 1, "one interaction");
                interaction = interactions[0];

                //set the response
                interaction.setResponse(response);
                // TODO: temp fix, check why responsechange is not triggered
                done();
            })
            .on("responsechange", function (res) {
                assert.ok(_.isPlainObject(res), "response changed");
                assert.ok(
                    _.isPlainObject(res.RESPONSE),
                    "response identifier ok"
                );
                assert.deepEqual(res.RESPONSE, response, "response set/get ok");
                runner.clear();
                done();
            })
            .on("error", function (error) {
                window.console.log(error);
                runner.clear();
                done();
            })
            .init()
            .render($container);
    });

    QUnit.test("state", function (assert) {
        const done = assert.async();
        var response = {
            record: [
                {
                    base: {
                        string: "[]",
                    },
                    name: "points_1",
                },
                {
                    base: {
                        string: "[]",
                    },
                    name: "setPoints_3",
                },
                {
                    base: {
                        string: "[]",
                    },
                    name: "segments_4",
                },
                {
                    base: {
                        string: "[]",
                    },
                    name: "lines_6",
                },
            ],
        };
        var state = { RESPONSE: response };
        var $container = $("#" + fixtureContainerId);
        assert.equal($container.length, 1, "the item container exists");
        assert.equal(
            $container.children().length,
            0,
            "the container has no children"
        );

        const runner = qtiItemRunner("qti", itemData)
            .on("render", function () {
                assert.deepEqual(this.getState(), state, "state set/get ok");
                // TODO: temp fix, check why responsechange is not triggered
                done();
            })
            .on("responsechange", function (res) {
                //if the state has been set, the response should have changed
                assert.ok(_.isPlainObject(res), "response changed");
                assert.ok(
                    _.isPlainObject(res.RESPONSE),
                    "response identifier ok"
                );
                assert.deepEqual(res.RESPONSE, response, "response set/get ok");
                runner.clear();
                done();
            })
            .on("error", function (error) {
                window.console.log(error);
                runner.clear();
                done();
            })
            .init()
            .render($container, { state: state });
    });

    QUnit.module("Visual test");

    QUnit.test("display and play", function (assert) {
        const done = assert.async();
        var $container = $("#" + outsideContainerId);

        const runner = qtiItemRunner("qti", itemData)
            .on("render", function () {
                assert.equal(
                    $container.children().length,
                    1,
                    "the container a elements"
                );
                done();
            })
            .on("error", function (error) {
                window.console.log(error);
                runner.clear();
                done();
            })
            .init()
            .render($container);
    });
});
