import Copy from '../../../utils/array/Copy.js';

const DistanceBetween = Phaser.Math.Distance.Between;
const Wrap = Phaser.Math.Wrap;
const Linear = Phaser.Math.Linear;

var AppendFromPathSegment = function (srcPathData, accumulationLengths, startT, endT, destPathData) {
    if (endT === undefined) {
        endT = startT;
        startT = 0;
    }

    startT = WrapT(startT);
    endT = WrapT(endT);

    if (startT === endT) {
        return;
    }

    var totalPathLength = accumulationLengths[accumulationLengths.length - 1];
    var startL = totalPathLength * startT;
    var endL = totalPathLength * endT;
    if (startT < endT) {
        AddPathSegment(srcPathData, accumulationLengths, startL, endL, destPathData);
    } else {
        AddPathSegment(srcPathData, accumulationLengths, startL, totalPathLength, destPathData);
        AddPathSegment(srcPathData, accumulationLengths, 0, endL, destPathData);
    }
}

var AddPathSegment = function (srcPathData, accumulationLengths, startL, endL, destPathData) {
    var skipState = (startL > 0);
    for (var i = 0, cnt = accumulationLengths.length; i < cnt; i++) {
        var pIdx = i * 2;
        var d = accumulationLengths[i];

        if (skipState) {
            if (d < startL) {
                continue;
            } else if (d == startL) {
                skipState = false;
            } else { // d > startL
                var deltaD = d - accumulationLengths[i - 1];
                var t = 1 - ((d - startL) / deltaD);
                destPathData.push(GetInterpolation(srcPathData, pIdx - 2, pIdx, t));
                destPathData.push(GetInterpolation(srcPathData, pIdx - 1, pIdx + 1, t));
                skipState = false;
            }
        }

        if (d <= endL) {
            destPathData.push(srcPathData[pIdx]);
            destPathData.push(srcPathData[pIdx + 1]);
            if (d === endL) {
                break;
            }
        } else { // d > endL
            var deltaD = d - accumulationLengths[i - 1];
            var t = 1 - ((d - endL) / deltaD);
            destPathData.push(GetInterpolation(srcPathData, pIdx - 2, pIdx, t));
            destPathData.push(GetInterpolation(srcPathData, pIdx - 1, pIdx + 1, t));
            break;
        }
    }
}

var GetInterpolation = function (pathData, i0, i1, t) {
    var p0 = pathData[i0], p1 = pathData[i1];
    return Linear(p0, p1, t);
}

var WrapT = function (t) {
    return ((t % 1) === 0) ? 1 : Wrap(t, 0, 1);
}

export default {
    updateAccumulationLengths() {
        if (this.accumulationLengths == null) {
            this.accumulationLengths = [];
        } else if (this.accumulationLengths.length === (this.pathData.length / 2)) {
            return this;
        }

        var accumulationLengths = this.accumulationLengths;
        var pathData = this.pathData;
        var prevX, prevY, x, y;
        var d, accumulationLength = 0;
        for (var i = 0, cnt = pathData.length; i < cnt; i += 2) {
            x = pathData[i];
            y = pathData[i + 1];

            d = (prevX === undefined) ? 0 : DistanceBetween(prevX, prevY, x, y);
            accumulationLength += d;
            accumulationLengths.push(accumulationLength);

            prevX = x;
            prevY = y;
        }

        this.totalPathLength = accumulationLength;

        return this;
    },

    savePathData() {
        if (this.pathDataSaved) {
            return this;
        }

        this.pathDataSave = [...this.pathData];
        this.pathData.length = 0;
        this.pathDataSaved = true;
        return this;
    },

    restorePathData() {
        if (!this.pathDataSaved) {
            return this;
        }

        Copy(this.pathData, this.pathDataSave);
        this.pathDataSave = undefined;
        this.pathDataSaved = false;
        return this;
    },

    setDisplayPathSegment(startT, endT) {
        if (!this.pathDataSaved) {
            this.updateAccumulationLengths();
            this.savePathData();
        }

        this.pathData.length = 0;
        AppendFromPathSegment(this.pathDataSave, this.accumulationLengths, startT, endT, this.pathData);

        return this;
    },

    appendFromPathSegment(src, startT, endT) {
        if (startT === undefined) {
            this.pathData.push(...src.pathData);
        } else {
            src.updateAccumulationLengths();
            AppendFromPathSegment(src.pathData, src.accumulationLengths, startT, endT, this.pathData);
        }

        this.lastPointX = this.pathData[this.pathData.length - 2];
        this.lastPointY = this.pathData[this.pathData.length - 1];
        return this;
    },
}