#include<iostream>
using namespace std;

int binarySearch(int arr[], int n, int key){
    int start = 0;
    int end = n - 1;

    while(start <= end){
        int mid = start + (end - start) / 2;

        if(arr[mid] == key){
            return mid;
        }
        else if(arr[mid] > key){
            end = mid - 1;
        }
        else{
            start = mid + 1;
        }
    }
    return -1;
}

int main(){
    int even[6] = {2,9,17,45,64,99};
    int odd[5] = {5,15,34,42,49};

    cout << binarySearch(even, 6, 17) << endl;
    cout << binarySearch(odd, 5, 49) << endl;

    return 0;
}