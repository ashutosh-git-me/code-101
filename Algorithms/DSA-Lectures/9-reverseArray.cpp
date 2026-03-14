#include<iostream>
using namespace std;

void reverse(int arr[], int size){
    int start=0;
    int end=size-1;
    while(start<=end){
        swap(arr[start],arr[end]);
        start++;
        end--;
    }
}

void printArray(int arr[], int size){
    cout<<"Printing Array: ";
    for(int i=0; i<size; i++){
        cout<<arr[i]<<" ";
    }
}

int main()
{
    int array[10]={65,10,2,1,90,67,45,17,43,18};
    int brray[9]={65,10,2,1,90,67,45,17,43};
    printArray(array, 10);
    reverse(array, 10);
    cout<<"Array Reversed!";
    printArray(array, 10);

    printArray(brray, 9);
    reverse(brray, 9);
    cout<<"Array Reversed!";
    printArray(brray, 9);



    return 0;
}